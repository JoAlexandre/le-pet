import { User } from '../../../domain/entities/user';
import { UserRepository } from '../../../domain/repositories/user-repository';
import { UserModel } from '../models/user-model';
import { UserDatabaseMapper } from '../mappers/user-database-mapper';

export class SequelizeUserRepository implements UserRepository {
  async findById(id: string): Promise<User | null> {
    const model = await UserModel.findByPk(id);
    return model ? UserDatabaseMapper.toDomain(model) : null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const model = await UserModel.findOne({ where: { email } });
    return model ? UserDatabaseMapper.toDomain(model) : null;
  }

  async findByProviderId(providerId: string): Promise<User | null> {
    const model = await UserModel.findOne({ where: { providerId } });
    return model ? UserDatabaseMapper.toDomain(model) : null;
  }

  async findAllByRole(
    role: string,
    page: number,
    limit: number,
  ): Promise<{ rows: User[]; count: number }> {
    const offset = (page - 1) * limit;
    const { rows, count } = await UserModel.findAndCountAll({
      where: { role, isOnboardingComplete: true },
      limit,
      offset,
      order: [['createdAt', 'DESC']],
    });

    return {
      rows: rows.map((row) => UserDatabaseMapper.toDomain(row)),
      count,
    };
  }

  async create(user: User): Promise<User> {
    const data = UserDatabaseMapper.toModel(user);
    const model = await UserModel.create(data as UserModel);
    return UserDatabaseMapper.toDomain(model);
  }

  async update(user: User): Promise<User> {
    const data = UserDatabaseMapper.toModel(user);
    await UserModel.update(data, { where: { id: user.id } });
    const updated = await UserModel.findByPk(user.id);
    return UserDatabaseMapper.toDomain(updated!);
  }

  async softDelete(id: string): Promise<void> {
    await UserModel.destroy({ where: { id } });
  }
}
