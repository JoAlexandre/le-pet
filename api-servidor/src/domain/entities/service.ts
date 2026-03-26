import { ServiceCategory } from '../enums/service-category';

export interface ServiceProps {
  id?: string;
  companyId?: string | null;
  professionalId?: string | null;
  name: string;
  description?: string | null;
  category: ServiceCategory;
  price: number;
  durationMinutes?: number | null;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date | null;
}

export class Service {
  public readonly id?: string;
  public companyId?: string | null;
  public professionalId?: string | null;
  public name: string;
  public description?: string | null;
  public category: ServiceCategory;
  public price: number;
  public durationMinutes?: number | null;
  public isActive: boolean;
  public readonly createdAt?: Date;
  public readonly updatedAt?: Date;
  public readonly deletedAt?: Date | null;

  constructor(props: ServiceProps) {
    this.id = props.id;
    this.companyId = props.companyId ?? null;
    this.professionalId = props.professionalId ?? null;
    this.name = props.name;
    this.description = props.description;
    this.category = props.category;
    this.price = props.price;
    this.durationMinutes = props.durationMinutes;
    this.isActive = props.isActive;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
    this.deletedAt = props.deletedAt;
  }
}
