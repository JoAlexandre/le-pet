import { PlanTier } from '../enums/plan-tier';
import { Role } from '../enums/role';

export interface PlanLimits {
  maxAnimals: number;
  maxServices: number;
  maxProducts: number;
  maxEmployees: number;
  maxLostAnimalPosts: number;
  maxMedicalRecordsPerMonth: number;
  canUsePetinder: boolean;
  canExposeSchedule: boolean;
  canUseOnlineAppointments: boolean;
  canUseMedicalRecords: boolean;
  hasSearchHighlight: boolean;
  hasVaccineNotifications: boolean;
  hasFullVaccineHistory: boolean;
  hasReports: boolean;
  hasAdvancedReports: boolean;
}

export interface PlanProps {
  id?: string;
  name: string;
  slug: string;
  tier: PlanTier;
  role: Role;
  price: number;
  currency: string;
  intervalMonths: number;
  stripePriceId: string | null;
  limits: PlanLimits;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export class Plan {
  public readonly id?: string;
  public name: string;
  public slug: string;
  public tier: PlanTier;
  public role: Role;
  public price: number;
  public currency: string;
  public intervalMonths: number;
  public stripePriceId: string | null;
  public limits: PlanLimits;
  public isActive: boolean;
  public readonly createdAt?: Date;
  public readonly updatedAt?: Date;

  constructor(props: PlanProps) {
    this.id = props.id;
    this.name = props.name;
    this.slug = props.slug;
    this.tier = props.tier;
    this.role = props.role;
    this.price = props.price;
    this.currency = props.currency;
    this.intervalMonths = props.intervalMonths;
    this.stripePriceId = props.stripePriceId;
    this.limits = props.limits;
    this.isActive = props.isActive;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }
}
