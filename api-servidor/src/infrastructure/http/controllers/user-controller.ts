import { Response, NextFunction } from 'express';
import { UpdateUserUseCase } from '../../../application/use-cases/user/update-user-use-case';
import { AuthenticatedRequest } from '../middlewares/auth-middleware';
import { UpdateUserDto } from '../../../application/dtos/update-user-dto';

export class UserController {
  constructor(private updateUserUseCase: UpdateUserUseCase) {}

  async update(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await this.updateUserUseCase.execute(
        req.params.id as string,
        req.user!.sub,
        req.body as UpdateUserDto,
      );
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
}
