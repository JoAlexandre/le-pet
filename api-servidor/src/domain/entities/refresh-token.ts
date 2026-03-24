export interface SessionProps {
  id?: string;
  userId: string;
  authProvider: string | null;
  token: string;
  expiresAt: Date;
  deviceInfo: string | null;
  ipAddress: string | null;
  userAgent: string | null;
  isActive: boolean;
  createdAt?: Date;
  lastUsedAt?: Date;
}

export class Session {
  public readonly id?: string;
  public userId: string;
  public authProvider: string | null;
  public token: string;
  public expiresAt: Date;
  public deviceInfo: string | null;
  public ipAddress: string | null;
  public userAgent: string | null;
  public isActive: boolean;
  public readonly createdAt?: Date;
  public lastUsedAt?: Date;

  constructor(props: SessionProps) {
    this.id = props.id;
    this.userId = props.userId;
    this.authProvider = props.authProvider;
    this.token = props.token;
    this.expiresAt = props.expiresAt;
    this.deviceInfo = props.deviceInfo;
    this.ipAddress = props.ipAddress;
    this.userAgent = props.userAgent;
    this.isActive = props.isActive;
    this.createdAt = props.createdAt;
    this.lastUsedAt = props.lastUsedAt;
  }

  isExpired(): boolean {
    return new Date() > this.expiresAt;
  }

  isValid(): boolean {
    return this.isActive && !this.isExpired();
  }
}
