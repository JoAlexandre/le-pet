import { PlanModel } from '../models/plan-model';
import { sequelize } from '../config/connection';
import { logger } from '../../../shared/logger';

interface PlanSeedData {
  name: string;
  slug: string;
  tier: string;
  role: string;
  price: number;
  currency: string;
  intervalMonths: number;
  limits: object;
}

const DEFAULT_LIMITS = {
  maxAnimals: 0,
  maxServices: 0,
  maxProducts: 0,
  maxEmployees: 0,
  maxLostAnimalPosts: 0,
  maxMedicalRecordsPerMonth: 0,
  maxAppointmentsPerMonth: 0,
  canUsePetinder: false,
  canUseLostAndFound: false,
  canExposeSchedule: false,
  canUseOnlineAppointments: false,
  canUseMedicalRecords: false,
  canUseMiniShop: false,
  canSharePetProfile: false,
  hasSearchHighlight: false,
  hasVaccineNotifications: false,
  hasFullVaccineHistory: false,
  hasEditableHistory: false,
  hasReports: false,
  hasAdvancedReports: false,
  hasPriorityNotifications: false,
  hasChatSupport: false,
};

function limits(overrides: Partial<typeof DEFAULT_LIMITS>): object {
  return { ...DEFAULT_LIMITS, ...overrides };
}

const plans: PlanSeedData[] = [
  // =============================================
  // TUTOR plans
  // =============================================
  {
    name: 'Tutor Free',
    slug: 'tutor-free',
    tier: 'FREE',
    role: 'TUTOR',
    price: 0,
    currency: 'BRL',
    intervalMonths: 1,
    limits: limits({
      maxAnimals: -1,
      hasFullVaccineHistory: true,
    }),
  },
  {
    name: 'Tutor Plus Mensal',
    slug: 'tutor-plus-monthly',
    tier: 'PLUS',
    role: 'TUTOR',
    price: 9.90,
    currency: 'BRL',
    intervalMonths: 1,
    limits: limits({
      maxAnimals: -1,
      maxLostAnimalPosts: -1,
      canUsePetinder: true,
      canUseLostAndFound: true,
      canSharePetProfile: true,
      hasVaccineNotifications: true,
      hasFullVaccineHistory: true,
    }),
  },
  {
    name: 'Tutor Plus Anual',
    slug: 'tutor-plus-annual',
    tier: 'PLUS',
    role: 'TUTOR',
    price: 106.90,
    currency: 'BRL',
    intervalMonths: 12,
    limits: limits({
      maxAnimals: -1,
      maxLostAnimalPosts: -1,
      canUsePetinder: true,
      canUseLostAndFound: true,
      canSharePetProfile: true,
      hasVaccineNotifications: true,
      hasFullVaccineHistory: true,
    }),
  },
  {
    name: 'Tutor Premium Mensal',
    slug: 'tutor-premium-monthly',
    tier: 'PREMIUM',
    role: 'TUTOR',
    price: 19.90,
    currency: 'BRL',
    intervalMonths: 1,
    limits: limits({
      maxAnimals: -1,
      maxLostAnimalPosts: -1,
      maxAppointmentsPerMonth: -1,
      canUsePetinder: true,
      canUseLostAndFound: true,
      canUseOnlineAppointments: true,
      canUseMiniShop: true,
      canSharePetProfile: true,
      hasVaccineNotifications: true,
      hasFullVaccineHistory: true,
      hasEditableHistory: true,
      hasPriorityNotifications: true,
      hasChatSupport: true,
    }),
  },
  {
    name: 'Tutor Premium Anual',
    slug: 'tutor-premium-annual',
    tier: 'PREMIUM',
    role: 'TUTOR',
    price: 214.90,
    currency: 'BRL',
    intervalMonths: 12,
    limits: limits({
      maxAnimals: -1,
      maxLostAnimalPosts: -1,
      maxAppointmentsPerMonth: -1,
      canUsePetinder: true,
      canUseLostAndFound: true,
      canUseOnlineAppointments: true,
      canUseMiniShop: true,
      canSharePetProfile: true,
      hasVaccineNotifications: true,
      hasFullVaccineHistory: true,
      hasEditableHistory: true,
      hasPriorityNotifications: true,
      hasChatSupport: true,
    }),
  },

  // =============================================
  // COMPANY plans
  // =============================================
  {
    name: 'Empresa Free',
    slug: 'company-free',
    tier: 'FREE',
    role: 'COMPANY',
    price: 0,
    currency: 'BRL',
    intervalMonths: 1,
    limits: limits({
      maxServices: 5,
      maxEmployees: 1,
      maxAppointmentsPerMonth: 10,
      canUseOnlineAppointments: true,
    }),
  },
  {
    name: 'Empresa Starter Mensal',
    slug: 'company-starter-monthly',
    tier: 'STARTER',
    role: 'COMPANY',
    price: 69.90,
    currency: 'BRL',
    intervalMonths: 1,
    limits: limits({
      maxServices: -1,
      maxEmployees: 3,
      maxAppointmentsPerMonth: -1,
      canExposeSchedule: true,
      canUseOnlineAppointments: true,
    }),
  },
  {
    name: 'Empresa Starter Anual',
    slug: 'company-starter-annual',
    tier: 'STARTER',
    role: 'COMPANY',
    price: 754.90,
    currency: 'BRL',
    intervalMonths: 12,
    limits: limits({
      maxServices: -1,
      maxEmployees: 3,
      maxAppointmentsPerMonth: -1,
      canExposeSchedule: true,
      canUseOnlineAppointments: true,
    }),
  },
  {
    name: 'Empresa Business Mensal',
    slug: 'company-business-monthly',
    tier: 'BUSINESS',
    role: 'COMPANY',
    price: 149.90,
    currency: 'BRL',
    intervalMonths: 1,
    limits: limits({
      maxServices: -1,
      maxProducts: -1,
      maxEmployees: 10,
      maxAppointmentsPerMonth: -1,
      canExposeSchedule: true,
      canUseOnlineAppointments: true,
      canUseMiniShop: true,
      hasSearchHighlight: true,
      hasReports: true,
    }),
  },
  {
    name: 'Empresa Business Anual',
    slug: 'company-business-annual',
    tier: 'BUSINESS',
    role: 'COMPANY',
    price: 1618.90,
    currency: 'BRL',
    intervalMonths: 12,
    limits: limits({
      maxServices: -1,
      maxProducts: -1,
      maxEmployees: 10,
      maxAppointmentsPerMonth: -1,
      canExposeSchedule: true,
      canUseOnlineAppointments: true,
      canUseMiniShop: true,
      hasSearchHighlight: true,
      hasReports: true,
    }),
  },
  {
    name: 'Empresa Enterprise Mensal',
    slug: 'company-enterprise-monthly',
    tier: 'ENTERPRISE',
    role: 'COMPANY',
    price: 249.90,
    currency: 'BRL',
    intervalMonths: 1,
    limits: limits({
      maxServices: -1,
      maxProducts: -1,
      maxEmployees: -1,
      maxAppointmentsPerMonth: -1,
      canExposeSchedule: true,
      canUseOnlineAppointments: true,
      canUseMiniShop: true,
      hasSearchHighlight: true,
      hasReports: true,
      hasAdvancedReports: true,
      hasPriorityNotifications: true,
      hasChatSupport: true,
    }),
  },
  {
    name: 'Empresa Enterprise Anual',
    slug: 'company-enterprise-annual',
    tier: 'ENTERPRISE',
    role: 'COMPANY',
    price: 2698.90,
    currency: 'BRL',
    intervalMonths: 12,
    limits: limits({
      maxServices: -1,
      maxProducts: -1,
      maxEmployees: -1,
      maxAppointmentsPerMonth: -1,
      canExposeSchedule: true,
      canUseOnlineAppointments: true,
      canUseMiniShop: true,
      hasSearchHighlight: true,
      hasReports: true,
      hasAdvancedReports: true,
      hasPriorityNotifications: true,
      hasChatSupport: true,
    }),
  },

  // =============================================
  // PROFESSIONAL plans
  // =============================================
  {
    name: 'Profissional Free',
    slug: 'professional-free',
    tier: 'FREE',
    role: 'PROFESSIONAL',
    price: 0,
    currency: 'BRL',
    intervalMonths: 1,
    limits: limits({
      maxServices: 3,
      maxMedicalRecordsPerMonth: 10,
      maxAppointmentsPerMonth: 10,
      canExposeSchedule: true,
      canUseMedicalRecords: true,
    }),
  },
  {
    name: 'Profissional Plus Mensal',
    slug: 'professional-plus-monthly',
    tier: 'PLUS',
    role: 'PROFESSIONAL',
    price: 14.90,
    currency: 'BRL',
    intervalMonths: 1,
    limits: limits({
      maxServices: -1,
      maxLostAnimalPosts: -1,
      maxMedicalRecordsPerMonth: -1,
      maxAppointmentsPerMonth: -1,
      canUsePetinder: true,
      canUseLostAndFound: true,
      canExposeSchedule: true,
      canUseOnlineAppointments: true,
      canUseMedicalRecords: true,
    }),
  },
  {
    name: 'Profissional Plus Anual',
    slug: 'professional-plus-annual',
    tier: 'PLUS',
    role: 'PROFESSIONAL',
    price: 160.90,
    currency: 'BRL',
    intervalMonths: 12,
    limits: limits({
      maxServices: -1,
      maxLostAnimalPosts: -1,
      maxMedicalRecordsPerMonth: -1,
      maxAppointmentsPerMonth: -1,
      canUsePetinder: true,
      canUseLostAndFound: true,
      canExposeSchedule: true,
      canUseOnlineAppointments: true,
      canUseMedicalRecords: true,
    }),
  },
  {
    name: 'Profissional Completo Mensal',
    slug: 'professional-complete-monthly',
    tier: 'COMPLETE',
    role: 'PROFESSIONAL',
    price: 34.90,
    currency: 'BRL',
    intervalMonths: 1,
    limits: limits({
      maxServices: -1,
      maxLostAnimalPosts: -1,
      maxMedicalRecordsPerMonth: -1,
      maxAppointmentsPerMonth: -1,
      canUsePetinder: true,
      canUseLostAndFound: true,
      canExposeSchedule: true,
      canUseOnlineAppointments: true,
      canUseMedicalRecords: true,
      hasSearchHighlight: true,
      hasReports: true,
      hasPriorityNotifications: true,
      hasChatSupport: true,
    }),
  },
  {
    name: 'Profissional Completo Anual',
    slug: 'professional-complete-annual',
    tier: 'COMPLETE',
    role: 'PROFESSIONAL',
    price: 376.90,
    currency: 'BRL',
    intervalMonths: 12,
    limits: limits({
      maxServices: -1,
      maxLostAnimalPosts: -1,
      maxMedicalRecordsPerMonth: -1,
      maxAppointmentsPerMonth: -1,
      canUsePetinder: true,
      canUseLostAndFound: true,
      canExposeSchedule: true,
      canUseOnlineAppointments: true,
      canUseMedicalRecords: true,
      hasSearchHighlight: true,
      hasReports: true,
      hasPriorityNotifications: true,
      hasChatSupport: true,
    }),
  },
];

export async function seedPlans(): Promise<void> {
  logger.info('Verificando planos existentes...');

  const existingCount = await PlanModel.count();

  if (existingCount > 0) {
    logger.info(`${existingCount} plano(s) ja existem no banco. Pulando seed.`);
    return;
  }

  logger.info(`Inserindo ${plans.length} planos no banco...`);

  for (const plan of plans) {
    await PlanModel.create({
      name: plan.name,
      slug: plan.slug,
      tier: plan.tier,
      role: plan.role,
      price: plan.price,
      currency: plan.currency,
      intervalMonths: plan.intervalMonths,
      stripePriceId: null,
      limits: JSON.stringify(plan.limits) as unknown as string,
      isActive: true,
    });

    logger.info(`  Plano "${plan.slug}" criado.`);
  }

  logger.info(`${plans.length} planos inseridos com sucesso!`);
}

if (require.main === module) {
  (async () => {
    try {
      await sequelize.authenticate();
      logger.info('Conexao com banco de dados estabelecida.');

      await seedPlans();
    } catch (error) {
      logger.error('Erro ao executar seed de planos:', error);
      process.exit(1);
    } finally {
      await sequelize.close();
      process.exit(0);
    }
  })();
}
