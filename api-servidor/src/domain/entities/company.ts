export interface CompanyProps {
  id?: string;
  userId: string;
  tradeName: string;
  legalName: string;
  cnpj?: string | null;
  phone: string;
  address: string;
  city: string;
  state: string;
  description?: string | null;
  logoUrl?: string | null;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date | null;
}

export class Company {
  public readonly id?: string;
  public userId: string;
  public tradeName: string;
  public legalName: string;
  public cnpj?: string | null;
  public phone: string;
  public address: string;
  public city: string;
  public state: string;
  public description?: string | null;
  public logoUrl?: string | null;
  public isActive: boolean;
  public readonly createdAt?: Date;
  public readonly updatedAt?: Date;
  public readonly deletedAt?: Date | null;

  constructor(props: CompanyProps) {
    this.id = props.id;
    this.userId = props.userId;
    this.tradeName = props.tradeName;
    this.legalName = props.legalName;
    this.cnpj = props.cnpj;
    this.phone = props.phone;
    this.address = props.address;
    this.city = props.city;
    this.state = props.state;
    this.description = props.description;
    this.logoUrl = props.logoUrl;
    this.isActive = props.isActive;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
    this.deletedAt = props.deletedAt;
  }
}
