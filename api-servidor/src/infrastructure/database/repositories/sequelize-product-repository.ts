import { Product } from '../../../domain/entities/product';
import { ProductRepository } from '../../../domain/repositories/product-repository';
import { ProductModel } from '../models/product-model';
import { ProductDatabaseMapper } from '../mappers/product-database-mapper';

export class SequelizeProductRepository implements ProductRepository {
  async findById(id: string): Promise<Product | null> {
    const model = await ProductModel.findByPk(id);
    return model ? ProductDatabaseMapper.toDomain(model) : null;
  }

  async findByCompanyId(
    companyId: string,
    page: number,
    limit: number,
  ): Promise<{ rows: Product[]; count: number }> {
    const offset = (page - 1) * limit;
    const { rows, count } = await ProductModel.findAndCountAll({
      where: { companyId },
      limit,
      offset,
      order: [['createdAt', 'DESC']],
    });

    return {
      rows: rows.map((row) => ProductDatabaseMapper.toDomain(row)),
      count,
    };
  }

  async findAll(page: number, limit: number): Promise<{ rows: Product[]; count: number }> {
    const offset = (page - 1) * limit;
    const { rows, count } = await ProductModel.findAndCountAll({
      where: { isActive: true },
      limit,
      offset,
      order: [['createdAt', 'DESC']],
    });

    return {
      rows: rows.map((row) => ProductDatabaseMapper.toDomain(row)),
      count,
    };
  }

  async create(product: Product): Promise<Product> {
    const data = ProductDatabaseMapper.toModel(product);
    const model = await ProductModel.create(data as ProductModel);
    return ProductDatabaseMapper.toDomain(model);
  }

  async update(product: Product): Promise<Product> {
    const data = ProductDatabaseMapper.toModel(product);
    await ProductModel.update(data, { where: { id: product.id } });
    const updated = await ProductModel.findByPk(product.id);
    return ProductDatabaseMapper.toDomain(updated!);
  }

  async softDelete(id: string): Promise<void> {
    await ProductModel.destroy({ where: { id } });
  }
}
