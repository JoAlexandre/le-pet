import { Response, NextFunction } from 'express';
import { CreateLostAnimalUseCase } from '../../../application/use-cases/lost-animal/create-lost-animal-use-case';
import { GetLostAnimalUseCase } from '../../../application/use-cases/lost-animal/get-lost-animal-use-case';
import { ListLostAnimalsUseCase } from '../../../application/use-cases/lost-animal/list-lost-animals-use-case';
import { ListMyLostAnimalsUseCase } from '../../../application/use-cases/lost-animal/list-my-lost-animals-use-case';
import { UpdateLostAnimalUseCase } from '../../../application/use-cases/lost-animal/update-lost-animal-use-case';
import { DeleteLostAnimalUseCase } from '../../../application/use-cases/lost-animal/delete-lost-animal-use-case';
import { AuthenticatedRequest } from '../middlewares/auth-middleware';
import { CreateLostAnimalDto } from '../../../application/dtos/create-lost-animal-dto';
import { UpdateLostAnimalDto } from '../../../application/dtos/update-lost-animal-dto';
import { FileStorageProvider } from '../../../application/interfaces/file-storage-provider';
import {
  ALLOWED_IMAGE_TYPES,
  ALLOWED_VIDEO_TYPES,
} from '../middlewares/upload-middleware';
import { validateVideoDuration } from '../../../shared/utils/video-validator';
import { DomainError } from '../../../shared/errors';

export class LostAnimalController {
  constructor(
    private createLostAnimalUseCase: CreateLostAnimalUseCase,
    private getLostAnimalUseCase: GetLostAnimalUseCase,
    private listLostAnimalsUseCase: ListLostAnimalsUseCase,
    private listMyLostAnimalsUseCase: ListMyLostAnimalsUseCase,
    private updateLostAnimalUseCase: UpdateLostAnimalUseCase,
    private deleteLostAnimalUseCase: DeleteLostAnimalUseCase,
    private fileStorageProvider: FileStorageProvider,
  ) {}

  async create(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const files = (req.files as Express.Multer.File[]) || [];
      const mediaItems = await this.processUploadedFiles(files);

      const dto: CreateLostAnimalDto = {
        ...(req.body as Omit<CreateLostAnimalDto, 'media'>),
        media: mediaItems,
      };

      const result = await this.createLostAnimalUseCase.execute(req.user!.sub, dto);
      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  }

  async getById(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await this.getLostAnimalUseCase.execute(req.params.id as string);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  async list(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const filters = {
        state: req.query.state as string | undefined,
        city: req.query.city as string | undefined,
        status: req.query.status as string | undefined,
      };
      const result = await this.listLostAnimalsUseCase.execute(page, limit, filters);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  async listMine(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const result = await this.listMyLostAnimalsUseCase.execute(req.user!.sub, page, limit);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  async update(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const dto: UpdateLostAnimalDto = req.body as UpdateLostAnimalDto;

      const result = await this.updateLostAnimalUseCase.execute(
        req.params.id as string,
        req.user!.sub,
        dto,
      );
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  async delete(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      await this.deleteLostAnimalUseCase.execute(req.params.id as string, req.user!.sub);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }

  async markAsFound(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await this.updateLostAnimalUseCase.execute(
        req.params.id as string,
        req.user!.sub,
        { status: 'FOUND' },
      );
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  private async processUploadedFiles(
    files: Express.Multer.File[],
  ): Promise<CreateLostAnimalDto['media']> {
    const mediaItems: NonNullable<CreateLostAnimalDto['media']> = [];
    let order = 1;

    for (const file of files) {
      const isVideo = ALLOWED_VIDEO_TYPES.includes(file.mimetype);

      // Validar duracao do video (max 15s)
      if (isVideo) {
        try {
          await validateVideoDuration(file.buffer);
        } catch (err) {
          throw new DomainError(
            err instanceof Error ? err.message : 'Invalid video duration',
            400,
          );
        }
      }

      const uploaded = await this.fileStorageProvider.upload(
        file.buffer,
        file.originalname,
        file.mimetype,
      );

      mediaItems.push({
        mediaType: ALLOWED_IMAGE_TYPES.includes(file.mimetype) ? 'PHOTO' : 'VIDEO',
        url: uploaded.url,
        displayOrder: order++,
      });
    }

    return mediaItems;
  }

}
