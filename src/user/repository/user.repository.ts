import { Container } from '@azure/cosmos';
import { InjectModel } from '@nestjs/azure-database';
import { Logger, Injectable } from '@nestjs/common';
import { User } from '../models/user.model';

@Injectable()
export class UserRepository {
  private logger = new Logger(this.constructor.name);
  constructor(@InjectModel(User) private readonly userContainer: Container) {}

  async create(item: User): Promise<User> {
    //item.createdAt = new Date();
    const response = await this.userContainer.items.create(item);
    this.logger.verbose(`Create RUs: ${response.requestCharge}`);
    return response.resource;
  }

  async findAll(): Promise<User[]> {
    const querySpec = {
      query: 'SELECT * FROM root r',
    };
    const results = await this.userContainer.items
      .query<User>(querySpec, {})
      .fetchAll();
    this.logger.verbose(`Find By Id RUs: ${results.requestCharge}`);
    return results.resources;
  }
}
