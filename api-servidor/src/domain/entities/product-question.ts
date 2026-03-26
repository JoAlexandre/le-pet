export interface ProductQuestionProps {
  id?: string;
  productId: string;
  userId: string;
  question: string;
  answer?: string | null;
  answeredBy?: string | null;
  answeredAt?: Date | null;
  createdAt?: Date;
  updatedAt?: Date;
}

export class ProductQuestion {
  public readonly id?: string;
  public productId: string;
  public userId: string;
  public question: string;
  public answer?: string | null;
  public answeredBy?: string | null;
  public answeredAt?: Date | null;
  public readonly createdAt?: Date;
  public readonly updatedAt?: Date;

  constructor(props: ProductQuestionProps) {
    this.id = props.id;
    this.productId = props.productId;
    this.userId = props.userId;
    this.question = props.question;
    this.answer = props.answer;
    this.answeredBy = props.answeredBy;
    this.answeredAt = props.answeredAt;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }
}
