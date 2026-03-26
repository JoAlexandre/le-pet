import { ProductSize } from '../../../domain/entities/product-size';
import { ProductSizeRepository } from '../../../domain/repositories/product-size-repository';
import { ProductSizeModel } from '../models/product-size-model';
import { ProductSizeDatabaseMapper } from '../mappers/product-size-database-mapper';

export class SequelizeProductSizeRepository implements ProductSizeRepository {
  async findById(id: string): Promise<ProductSize | null> {
    const model = await ProductSizeModel.findByPk(id);
    return model ? ProductSizeDatabaseMapper.toDomain(model) : null;
  }

  async findByProductId(productId: string): Promise<ProductSize[]> {
    const models = await ProductSizeModel.findAll({
      where: { productId },
      order: [['createdAt', 'ASC']],
    });
    return models.map((m) => ProductSizeDatabaseMapper.toDomain(m));
  }

  async create(size: ProductSize): Promise<ProductSize> {
    const data = ProductSizeDatabaseMapper.toModel(size);
    const model = await ProductSizeModel.create(data as ProductSizeModel);
    return ProductSizeDatabaseMapper.toDomain(model);
  }

  async update(size: ProductSize): Promise<ProductSize> {
    const data = ProductSizeDatabaseMapper.toModel(size);
    await ProductSizeModel.update(data, { where: { id: size.id } });
    const updated = await ProductSizeModel.findByPk(size.id);
    return ProductSizeDatabaseMapper.toDomain(updated!);
  }

  async delete(id: string): Promise<void> {
    await ProductSizeModel.destroy({ where: { id } });
  }
}
