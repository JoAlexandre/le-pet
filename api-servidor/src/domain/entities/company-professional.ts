export interface CompanyProfessionalProps {
  id?: string;
  companyId: string;
  userId: string;
  createdAt?: Date;
  deletedAt?: Date | null;
}

export class CompanyProfessional {
  public readonly id?: string;
  public companyId: string;
  public userId: string;
  public readonly createdAt?: Date;
  public readonly deletedAt?: Date | null;

  constructor(props: CompanyProfessionalProps) {
    this.id = props.id;
    this.companyId = props.companyId;
    this.userId = props.userId;
    this.createdAt = props.createdAt;
    this.deletedAt = props.deletedAt;
  }
}
