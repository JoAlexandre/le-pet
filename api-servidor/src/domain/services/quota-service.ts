import { Plan, PlanLimits } from '../entities/plan';
import { PlanTier } from '../enums/plan-tier';
import { Role } from '../enums/role';
import { QuotaExceededError } from '../errors/quota-exceeded-error';
import { PlanRepository } from '../repositories/plan-repository';
import { SubscriptionRepository } from '../repositories/subscription-repository';

const NUMERIC_LIMITS: (keyof PlanLimits)[] = [
  'maxAnimals',
  'maxServices',
  'maxProducts',
  'maxEmployees',
  'maxLostAnimalPosts',
  'maxMedicalRecordsPerMonth',
];

const BOOLEAN_FEATURES: (keyof PlanLimits)[] = [
  'canUsePetinder',
  'canExposeSchedule',
  'canUseOnlineAppointments',
  'canUseMedicalRecords',
  'hasSearchHighlight',
  'hasVaccineNotifications',
  'hasFullVaccineHistory',
  'hasReports',
  'hasAdvancedReports',
];

export class QuotaService {
  constructor(
    private planRepository: PlanRepository,
    private subscriptionRepository: SubscriptionRepository,
  ) {}

  async getActivePlanForUser(userId: string, userRole: Role): Promise<Plan> {
    if (userRole === Role.ADMIN) {
      return this.getUnlimitedPlan();
    }

    const subscription = await this.subscriptionRepository.findActiveByUserId(userId);

    if (subscription) {
      const plan = await this.planRepository.findById(subscription.planId);
      if (plan) {
        return plan;
      }
    }

    const freePlan = await this.planRepository.findByRoleAndTier(userRole, PlanTier.FREE);
    if (!freePlan) {
      return this.getUnlimitedPlan();
    }

    return freePlan;
  }

  async checkQuota(
    userId: string,
    userRole: Role,
    feature: string,
    currentCount?: number,
  ): Promise<void> {
    if (userRole === Role.ADMIN) {
      return;
    }

    const plan = await this.getActivePlanForUser(userId, userRole);
    const limits = plan.limits;
    const key = feature as keyof PlanLimits;

    if (NUMERIC_LIMITS.includes(key)) {
      const limit = limits[key] as number;
      if (limit === -1) {
        return;
      }
      if (currentCount !== undefined && currentCount >= limit) {
        throw new QuotaExceededError(feature, limit, currentCount);
      }
    } else if (BOOLEAN_FEATURES.includes(key)) {
      const allowed = limits[key] as boolean;
      if (!allowed) {
        throw new QuotaExceededError(feature, 0);
      }
    }
  }

  async hasFeature(userId: string, userRole: Role, feature: string): Promise<boolean> {
    if (userRole === Role.ADMIN) {
      return true;
    }

    const plan = await this.getActivePlanForUser(userId, userRole);
    const limits = plan.limits;
    const key = feature as keyof PlanLimits;

    if (BOOLEAN_FEATURES.includes(key)) {
      return limits[key] as boolean;
    }

    return true;
  }

  private getUnlimitedPlan(): Plan {
    return new Plan({
      name: 'Admin',
      slug: 'admin-unlimited',
      tier: PlanTier.PREMIUM,
      role: Role.ADMIN,
      price: 0,
      currency: 'BRL',
      intervalMonths: 1,
      stripePriceId: null,
      limits: {
        maxAnimals: -1,
        maxServices: -1,
        maxProducts: -1,
        maxEmployees: -1,
        maxLostAnimalPosts: -1,
        maxMedicalRecordsPerMonth: -1,
        canUsePetinder: true,
        canExposeSchedule: true,
        canUseOnlineAppointments: true,
        canUseMedicalRecords: true,
        hasSearchHighlight: true,
        hasVaccineNotifications: true,
        hasFullVaccineHistory: true,
        hasReports: true,
        hasAdvancedReports: true,
      },
      isActive: true,
    });
  }
}
