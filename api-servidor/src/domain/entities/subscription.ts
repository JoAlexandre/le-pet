import { SubscriptionStatus } from '../enums/subscription-status';

export interface SubscriptionProps {
  id?: string;
  userId: string;
  planId: string;
  stripeCustomerId: string | null;
  stripeSubscriptionId: string | null;
  status: SubscriptionStatus;
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
  cancelAtPeriodEnd: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export class Subscription {
  public readonly id?: string;
  public userId: string;
  public planId: string;
  public stripeCustomerId: string | null;
  public stripeSubscriptionId: string | null;
  public status: SubscriptionStatus;
  public currentPeriodStart: Date;
  public currentPeriodEnd: Date;
  public cancelAtPeriodEnd: boolean;
  public readonly createdAt?: Date;
  public readonly updatedAt?: Date;

  constructor(props: SubscriptionProps) {
    this.id = props.id;
    this.userId = props.userId;
    this.planId = props.planId;
    this.stripeCustomerId = props.stripeCustomerId;
    this.stripeSubscriptionId = props.stripeSubscriptionId;
    this.status = props.status;
    this.currentPeriodStart = props.currentPeriodStart;
    this.currentPeriodEnd = props.currentPeriodEnd;
    this.cancelAtPeriodEnd = props.cancelAtPeriodEnd;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }
}
