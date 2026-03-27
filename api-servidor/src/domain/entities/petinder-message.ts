export interface PetinderMessageProps {
  id?: string;
  matchId: string;
  senderId: string;
  content: string;
  createdAt?: Date;
}

export class PetinderMessage {
  public readonly id?: string;
  public matchId: string;
  public senderId: string;
  public content: string;
  public readonly createdAt?: Date;

  constructor(props: PetinderMessageProps) {
    this.id = props.id;
    this.matchId = props.matchId;
    this.senderId = props.senderId;
    this.content = props.content;
    this.createdAt = props.createdAt;
  }
}
