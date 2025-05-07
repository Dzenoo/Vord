import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, UpdateQuery, UpdateWriteOpResult } from 'mongoose';
import { User, UserDocument } from './schema/user.schema';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  async findAndUpdateOne(
    query: FilterQuery<User> = {},
    update: UpdateQuery<User> = {},
  ): Promise<UpdateWriteOpResult> {
    return await this.userModel.updateOne(query, update).exec();
  }

  async findOne(query: FilterQuery<User> = {}): Promise<UserDocument | null> {
    return await this.userModel.findOne(query).exec();
  }

  async createOne(body: Partial<User>): Promise<UserDocument | null> {
    return await this.userModel.create(body);
  }
}
