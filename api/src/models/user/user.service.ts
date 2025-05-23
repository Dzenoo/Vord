import {
  Connection,
  FilterQuery,
  Model,
  Types,
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

  async find(query: FilterQuery<User> = {}): Promise<User[]> {
    return await this.userModel.find(query).exec();
  }

  async findAndUpdateOne(
    query: FilterQuery<User> = {},
    update: UpdateQuery<User> = {},
  ): Promise<UpdateWriteOpResult> {
    return await this.userModel.updateOne(query, update).exec();
  }

  async findAndUpdateMany(
    query: FilterQuery<User> = {},
    update: UpdateQuery<User> = {},
  ): Promise<UpdateWriteOpResult> {
    return await this.userModel.updateMany(query, update).exec();
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
        message: 'Request successfully sent!',
      };
    });
  }

  async respondToFriendRequest(
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

  async getAllFriendRequests(
    userId: string,
    type: 'incoming' | 'outgoing',
    query: GetFriendsDto,
  ) {
    const { page = 1, limit = 10, search } = query;

    const pipeline: any[] = [
      { $match: { _id: new Types.ObjectId(userId) } },
      {
        $project: {
          friendRequests: {
            $filter: {
              input: '$friendRequests',
              as: 'req',
              cond: { $eq: ['$$req.type', type] },
            },
          },
        },
      },
      { $unwind: '$friendRequests' },
      {
        $lookup: {
          from: 'users',
          localField: 'friendRequests.user',
          foreignField: '_id',
          as: 'friendUser',
        },
      },
      { $unwind: '$friendUser' },
    ];

    if (search) {
      pipeline.push({
        $match: {
          'friendUser.username': {
            $regex: new RegExp(search, 'i'),
          },
        },
      });
    }

    pipeline.push(
      { $sort: { 'friendRequests.createdAt': -1 } },
      { $skip: (page - 1) * limit },
      { $limit: limit },
      {
        $project: {
          _id: 0,
          request: {
            user: {
              _id: '$friendUser._id',
              username: '$friendUser.username',
              avatarUrl: '$friendUser.avatarUrl',
            },
            type: '$friendRequests.type',
            createdAt: '$friendRequests.createdAt',
          },
        },
      },
    );

    const result = await this.userModel.aggregate(pipeline);

    return {
      data: {
        requests: result.map((r) => r.request),
      },
      meta: {
        page,
        limit,
      },
    };
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
      data: { friends },
      meta: { total },
    };
  }

  async removeFriend(userId: string, friendId: string) {
    return withTransaction(this.connection, async (session) => {
      const loggedInUser = await this.userModel
        .findById(userId)
        .session(session);
      const friend = await this.userModel.findById(friendId).session(session);

      if (!loggedInUser || !friend)
        throw new NotFoundException('User not found!');

      const areFriends =
        loggedInUser.friends.includes(friend._id) &&
        friend.friends.includes(loggedInUser._id);
      if (!areFriends) throw new BadRequestException();

      loggedInUser.friends = loggedInUser.friends.filter(
        (id) => !id.equals(friend._id),
      );
      friend.friends = friend.friends.filter(
        (id) => !id.equals(loggedInUser._id),
      );

      await loggedInUser.save({ session });
      await friend.save({ session });

      return {
        status: HttpStatus.OK,
        message: 'Sucessfully removed friend',
      };
    });
  }
}
