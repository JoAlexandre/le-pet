import { Response, NextFunction } from 'express';
import { CreateProductUseCase } from '../../../application/use-cases/product/create-product-use-case';
import { GetProductUseCase } from '../../../application/use-cases/product/get-product-use-case';
import { ListProductsUseCase } from '../../../application/use-cases/product/list-products-use-case';
import { UpdateProductUseCase } from '../../../application/use-cases/product/update-product-use-case';
import { DeleteProductUseCase } from '../../../application/use-cases/product/delete-product-use-case';
import { AddProductSizeUseCase } from '../../../application/use-cases/product/add-product-size-use-case';
import {
  UpdateProductSizeUseCase,
  UpdateProductSizeDto,
} from '../../../application/use-cases/product/update-product-size-use-case';
import { DeleteProductSizeUseCase } from '../../../application/use-cases/product/delete-product-size-use-case';
import { RateProductUseCase } from '../../../application/use-cases/product/rate-product-use-case';
import { ListProductRatingsUseCase } from '../../../application/use-cases/product/list-product-ratings-use-case';
import { ToggleFavoriteUseCase } from '../../../application/use-cases/product/toggle-favorite-use-case';
import { ListFavoritesUseCase } from '../../../application/use-cases/product/list-favorites-use-case';
import { AskProductQuestionUseCase } from '../../../application/use-cases/product/ask-product-question-use-case';
import { AnswerProductQuestionUseCase } from '../../../application/use-cases/product/answer-product-question-use-case';
import { ListProductQuestionsUseCase } from '../../../application/use-cases/product/list-product-questions-use-case';
import { AuthenticatedRequest } from '../middlewares/auth-middleware';
import {
  CreateProductDto,
  CreateProductSizeDto,
} from '../../../application/dtos/create-product-dto';
import { UpdateProductDto } from '../../../application/dtos/update-product-dto';
import { RateProductDto } from '../../../application/dtos/rate-product-dto';
import { AskProductQuestionDto } from '../../../application/dtos/ask-product-question-dto';
import { AnswerProductQuestionDto } from '../../../application/dtos/answer-product-question-dto';

export class ProductController {
  constructor(
    private createProductUseCase: CreateProductUseCase,
    private getProductUseCase: GetProductUseCase,
    private listProductsUseCase: ListProductsUseCase,
    private updateProductUseCase: UpdateProductUseCase,
    private deleteProductUseCase: DeleteProductUseCase,
    private addProductSizeUseCase: AddProductSizeUseCase,
    private updateProductSizeUseCase: UpdateProductSizeUseCase,
    private deleteProductSizeUseCase: DeleteProductSizeUseCase,
    private rateProductUseCase: RateProductUseCase,
    private listProductRatingsUseCase: ListProductRatingsUseCase,
    private toggleFavoriteUseCase: ToggleFavoriteUseCase,
    private listFavoritesUseCase: ListFavoritesUseCase,
    private askProductQuestionUseCase: AskProductQuestionUseCase,
    private answerProductQuestionUseCase: AnswerProductQuestionUseCase,
    private listProductQuestionsUseCase: ListProductQuestionsUseCase,
  ) {}

  async create(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await this.createProductUseCase.execute(
        req.user!.sub,
        req.user!.role!,
        req.body as CreateProductDto,
      );
      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  }

  async getById(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await this.getProductUseCase.execute(req.params.id as string, req.user!.sub);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  async list(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const companyId = req.query.companyId as string | undefined;
      const result = await this.listProductsUseCase.execute(page, limit, companyId, req.user!.sub);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  async update(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await this.updateProductUseCase.execute(
        req.params.id as string,
        req.user!.sub,
        req.body as UpdateProductDto,
      );
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  async delete(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      await this.deleteProductUseCase.execute(req.params.id as string, req.user!.sub);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }

  async addSize(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await this.addProductSizeUseCase.execute(
        req.params.id as string,
        req.user!.sub,
        req.body as CreateProductSizeDto,
      );
      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  }

  async updateSize(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await this.updateProductSizeUseCase.execute(
        req.params.sizeId as string,
        req.user!.sub,
        req.body as UpdateProductSizeDto,
      );
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  async deleteSize(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      await this.deleteProductSizeUseCase.execute(req.params.sizeId as string, req.user!.sub);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }

  async rate(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await this.rateProductUseCase.execute(
        req.params.id as string,
        req.user!.sub,
        req.body as RateProductDto,
      );
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  async listRatings(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const result = await this.listProductRatingsUseCase.execute(
        req.params.id as string,
        page,
        limit,
      );
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  async toggleFavorite(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const result = await this.toggleFavoriteUseCase.execute(
        req.params.id as string,
        req.user!.sub,
      );
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  async listFavorites(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const result = await this.listFavoritesUseCase.execute(req.user!.sub, page, limit);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  async askQuestion(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await this.askProductQuestionUseCase.execute(
        req.params.id as string,
        req.user!.sub,
        req.body as AskProductQuestionDto,
      );
      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  }

  async answerQuestion(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const result = await this.answerProductQuestionUseCase.execute(
        req.params.questionId as string,
        req.user!.sub,
        req.body as AnswerProductQuestionDto,
      );
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  async listQuestions(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const result = await this.listProductQuestionsUseCase.execute(
        req.params.id as string,
        page,
        limit,
      );
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
}
