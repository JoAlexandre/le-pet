import Stripe from 'stripe';
import { config } from '../../../shared/config';
import { PlanModel } from '../models/plan-model';
import { sequelize } from '../config/connection';
import { logger } from '../../../shared/logger';

const stripe = new Stripe(config.stripe.secretKey!);

interface PlanGroup {
  role: string;
  tier: string;
  productName: string;
  productDescription: string;
  plans: PlanModel[];
}

function buildProductName(role: string, tier: string): string {
  const roleNames: Record<string, string> = {
    TUTOR: 'Tutor',
    COMPANY: 'Empresa',
    PROFESSIONAL: 'Profissional',
  };

  const tierNames: Record<string, string> = {
    PLUS: 'Plus',
    PREMIUM: 'Premium',
    STARTER: 'Starter',
    BUSINESS: 'Business',
    ENTERPRISE: 'Enterprise',
    COMPLETE: 'Completo',
  };

  return `LePet ${roleNames[role] || role} ${tierNames[tier] || tier}`;
}

function buildProductDescription(role: string, tier: string): string {
  const descriptions: Record<string, Record<string, string>> = {
    TUTOR: {
      PLUS: 'Petinder, Lost & Found, lembretes de vacina e perfil compartilhavel do pet.',
      PREMIUM: 'Tudo do Plus + historico editavel, agendamentos, mini loja, notificacoes prioritarias e suporte por chat.',
    },
    COMPANY: {
      STARTER: 'Servicos e agendamentos ilimitados, gestao de agenda da equipe. Ate 3 usuarios.',
      BUSINESS: 'Tudo do Starter + catalogo de produtos (mini loja), relatorios basicos. Ate 10 usuarios.',
      ENTERPRISE: 'Tudo do Business + analytics avancados, suporte prioritario, API de integracao. Usuarios ilimitados.',
    },
    PROFESSIONAL: {
      PLUS: 'Feed de pets perdidos, visibilidade no Petinder, servicos e atendimentos ilimitados.',
      COMPLETE: 'Tudo do Plus + vinculo com multiplas empresas, relatorios de atendimento e suporte prioritario.',
    },
  };

  return descriptions[role]?.[tier] || `Plano ${tier} para ${role}`;
}

function getStripeInterval(intervalMonths: number): 'month' | 'year' {
  return intervalMonths === 12 ? 'year' : 'month';
}

function groupPlansByProduct(plans: PlanModel[]): PlanGroup[] {
  const groups = new Map<string, PlanGroup>();

  for (const plan of plans) {
    const key = `${plan.role}-${plan.tier}`;

    if (!groups.has(key)) {
      groups.set(key, {
        role: plan.role,
        tier: plan.tier,
        productName: buildProductName(plan.role, plan.tier),
        productDescription: buildProductDescription(plan.role, plan.tier),
        plans: [],
      });
    }

    groups.get(key)!.plans.push(plan);
  }

  return Array.from(groups.values());
}

async function findExistingProduct(productName: string): Promise<Stripe.Product | null> {
  const products = await stripe.products.search({
    query: `name:"${productName}" AND active:"true"`,
  });

  return products.data[0] || null;
}

export async function seedStripeProducts(): Promise<void> {
  logger.info('Iniciando criacao de Stripe Products/Prices...');

  const paidPlans = await PlanModel.findAll({
    where: {
      isActive: true,
    },
    order: [
      ['role', 'ASC'],
      ['tier', 'ASC'],
      ['intervalMonths', 'ASC'],
    ],
  });

  // Filtra apenas planos pagos (price > 0) sem stripe_price_id
  const plansToProcess = paidPlans.filter(
    (p) => Number(p.price) > 0 && !p.stripePriceId,
  );

  if (plansToProcess.length === 0) {
    logger.info('Todos os planos pagos ja possuem stripe_price_id. Nada a fazer.');
    return;
  }

  logger.info(`${plansToProcess.length} plano(s) sem stripe_price_id encontrados.`);

  const groups = groupPlansByProduct(plansToProcess);

  for (const group of groups) {
    logger.info(`Processando produto: ${group.productName}...`);

    // Verifica se o produto ja existe no Stripe (idempotencia)
    let product = await findExistingProduct(group.productName);

    if (!product) {
      product = await stripe.products.create({
        name: group.productName,
        description: group.productDescription,
        metadata: {
          role: group.role,
          tier: group.tier,
          platform: 'lepet',
        },
      });
      logger.info(`  Produto criado: ${product.id}`);
    } else {
      logger.info(`  Produto ja existe: ${product.id}`);
    }

    for (const plan of group.plans) {
      const interval = getStripeInterval(plan.intervalMonths);
      const unitAmount = Math.round(Number(plan.price) * 100);

      // Verifica se ja existe um preco ativo para este produto + intervalo + valor
      const existingPrices = await stripe.prices.list({
        product: product.id,
        active: true,
      });

      const existingPrice = existingPrices.data.find(
        (p) =>
          p.unit_amount === unitAmount &&
          p.currency === plan.currency.toLowerCase() &&
          p.recurring?.interval === interval,
      );

      let priceId: string;

      if (existingPrice) {
        priceId = existingPrice.id;
        logger.info(`  Preco ja existe para ${plan.slug}: ${priceId}`);
      } else {
        const price = await stripe.prices.create({
          product: product.id,
          unit_amount: unitAmount,
          currency: plan.currency.toLowerCase(),
          recurring: {
            interval,
          },
          metadata: {
            planSlug: plan.slug,
            role: group.role,
            tier: group.tier,
            platform: 'lepet',
          },
        });
        priceId = price.id;
        logger.info(`  Preco criado para ${plan.slug}: ${priceId} (${interval})`);
      }

      // Atualiza o plano no banco com o stripe_price_id
      await PlanModel.update(
        { stripePriceId: priceId },
        { where: { id: plan.id } },
      );

      logger.info(`  Plano "${plan.slug}" atualizado com stripe_price_id: ${priceId}`);
    }
  }

  logger.info('Stripe Products/Prices criados com sucesso!');
}

// Execucao direta via ts-node/tsx
if (require.main === module) {
  (async () => {
    try {
      await sequelize.authenticate();
      logger.info('Conexao com banco de dados estabelecida.');

      await seedStripeProducts();
    } catch (error) {
      logger.error('Erro ao executar seed de Stripe Products/Prices:', error);
      process.exit(1);
    } finally {
      await sequelize.close();
      process.exit(0);
    }
  })();
}
