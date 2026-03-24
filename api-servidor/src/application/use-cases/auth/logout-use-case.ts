import { SessionService } from '../../services/refresh-token-service';

export class LogoutUseCase {
  constructor(private sessionService: SessionService) {}

  async execute(userId: string): Promise<void> {
    await this.sessionService.deactivateAllByUserId(userId);
  }
}
