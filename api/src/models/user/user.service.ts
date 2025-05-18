import {
  Connection,
  FilterQuery,
  Model,
  UpdateQuery,
  UpdateWriteOpResult,
} from 'mongoose';
import {
  BadRequestException,
  ConflictException,
  HttpStatus,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';

import { User, UserDocument } from './schema/user.schema';
import { ServerMember } from './schema/server-member.schema';

import { SendFriendRequestDto } from './dto/send-friend-request.dto';
import { GetFriendsDto } from './dto/get-friends.dto';

import { withTransaction } from '@/common/utils';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    @InjectModel(ServerMember.name)
    private readonly serverMemberModel: Model<ServerMember>,
    @InjectConnection() private readonly connection: Connection,
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

  async sendFriendRequest(userId: string, body: SendFriendRequestDto) {
    return withTransaction(this.connection, async (session) => {
      const sender = await this.userModel.findById(userId).session(session);
      if (!sender) throw new UnauthorizedException();

      if (sender.username === body.username) throw new ConflictException();

      const receiver = await this.userModel
        .findOne({ username: body.username })
        .session(session);
      if (!receiver)
        throw new NotFoundException('User with this username cannot be found!');

      const areAlreadyFriends =
        sender.friends.includes(receiver._id) ||
        receiver.friends.includes(sender._id);
      if (areAlreadyFriends)
        throw new ConflictException('User is already your friend');

      const requestExists =
        sender.friendRequests.some((req) => req.user.equals(receiver._id)) ||
        receiver.friendRequests.some((req) => req.user.equals(sender._id));
      if (requestExists)
        throw new ConflictException('Friend request already exists');

      receiver.friendRequests.push({
        user: sender._id,
        type: 'incoming',
        createdAt: new Date(),
      });

      sender.friendRequests.push({
        user: receiver._id,
        type: 'outgoing',
        createdAt: new Date(),
      });

      await receiver.save({ session });
      await sender.save({ session });

      return {
        status: HttpStatus.CREATED,
        message: 'Request successfully sended!',
      };
    });
  }

  async manageFriendRequest(
    userId: string,
    senderId: string,
    state: 'accept' | 'reject',
  ) {
    return withTransaction(this.connection, async (session) => {
      const receiver = await this.userModel.findById(userId).session(session);
      const sender = await this.userModel.findById(senderId).session(session);

      if (!receiver || !sender) throw new NotFoundException();

      const receiverRequest = receiver.friendRequests.find(
        (r) => r.user.equals(sender._id) && r.type === 'incoming',
      );
      const senderRequest = sender.friendRequests.find(
        (r) => r.user.equals(receiver._id) && r.type === 'outgoing',
      );
      if (!receiverRequest || !senderRequest)
        throw new BadRequestException('No friend request found');

      if (state === 'accept') {
        receiver.friends.push(sender._id);
        sender.friends.push(receiver._id);
      }

      receiver.friendRequests = receiver.friendRequests.filter(
        (r) => !r.user.equals(sender._id),
      );
      sender.friendRequests = sender.friendRequests.filter(
        (r) => !r.user.equals(receiver._id),
      );

      await receiver.save({ session });
      await sender.save({ session });

      return {
        status: HttpStatus.OK,
        message: `Friend request ${state}ed`,
      };
    });
  }

  async getAllFriends(userId: string, query: GetFriendsDto) {
    const { page = 1, limit = 10, search } = query;

    const user = await this.userModel.findById(userId).select('friends');
    if (!user) throw new NotFoundException();

    const match: any = { _id: { $in: user.friends } };

    if (search) {
      const regex = new RegExp(search, 'i');
      match.username = regex;
    }

    const friends = await this.userModel
      .find(match)
      .skip((page - 1) * limit)
      .limit(limit)
      .select('username');

    const total = await this.userModel.countDocuments(match);

    return {
      status: HttpStatus.OK,
      friends,
      total,
    };
  }
}
