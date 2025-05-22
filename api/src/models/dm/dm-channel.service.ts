import { Model, Types } from 'mongoose';
import {
  ConflictException,
  HttpStatus,
  Injectable,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { DmChannel, DmChannelDocument } from './schema/dm-channel.schema';
import { CreateGroupDmDto, CreateOneOnOneDmDto } from './dto/create-dm.dto';
import { UserService } from '../user/user.service';
import { GetDmsDto } from './dto/get-dms.dto';

@Injectable()
export class DmChannelService {
  constructor(
    @InjectModel(DmChannel.name)
    private readonly dmChannelModel: Model<DmChannel>,
    private readonly userService: UserService,
  ) {}

  async createOneOnOne(body: CreateOneOnOneDmDto) {
    if (body.userA === body.userB) {
      throw new NotAcceptableException('Cannot create DM with yourself.');
    }

    const doesUsersExists = await this.userService.find({
      _id: {
        $in: [body.userA, body.userB],
      },
    });

    if (doesUsersExists.length !== 2) {
      throw new NotAcceptableException('One or more users do not exist.');
    }

    const participants = [body.userA, body.userB]
      .map((u) => u.toString())
      .sort();

    const [firstId, secondId] = participants;

    let dm = await this.dmChannelModel.findOne({
      participants: { $size: 2, $all: [firstId, secondId] },
    });

    if (!dm) {
      dm = await this.dmChannelModel.create({
        participants,
      });
      await this.userService.findAndUpdateMany(
        { _id: { $in: [firstId, secondId] } },
        { $addToSet: { directMessages: dm._id } },
      );
    }

    return {
      status: HttpStatus.ACCEPTED,
      data: { dm: dm },
    };
  }

  async createGroup(creator: string, body: CreateGroupDmDto) {
    if (body.participants.length < 2) {
      throw new NotAcceptableException(
        'Group DMs require at least 3 participants (including yourself)',
      );
    }

    const participants = Array.from(
      new Set([creator, ...body.participants.map((id) => id.toString())]),
    ).map((id) => new Types.ObjectId(id));

    const existing = await this.dmChannelModel.findOne({
      participants: { $all: participants, $size: participants.length },
    });

    if (existing) {
      throw new ConflictException(
        'A group with these participants already exists.',
      );
    }

    const group = await this.dmChannelModel.create({
      participants,
      creator,
      name: body.name ?? null,
      icon: body.icon ?? null,
    });

    await this.userService.findAndUpdateMany(
      {
        _id: { $in: participants },
      },
      {
        $addToSet: { directMessages: group._id },
      },
    );

    return {
      status: HttpStatus.CREATED,
      data: { group },
    };
  }

  async getAll(userId: string, query: GetDmsDto) {
    const { page = 1, limit = 15 } = query;

    const dms = await this.dmChannelModel
      .find({
        participants: userId,
      })
      .populate('participants')
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    if (dms.length === 0) {
      return {
        data: [],
      };
    }

    const detailed = await Promise.all(
      dms.map((dm) => this.getDmData(dm, userId)),
    );

    return {
      data: detailed,
      count: detailed.length,
      page,
      limit,
    };
  }

  async getOne(dmId: string, userId: string) {
    const dm = await this.dmChannelModel
      .findById(dmId)
      .populate('participants')
      .lean();

    if (!dm || !dm.participants.find((p) => p._id.toString() === userId)) {
      throw new NotFoundException('DM not found or you are not a participant');
    }

    return await this.getDmData(dm, userId);
  }

  private async getDmData(dm: any, userId: string) {
    const isGroup = dm.participants.length > 2;

    if (isGroup) {
      return {
        id: dm._id,
        type: 'group',
        name: dm.name,
        icon: dm.icon,
        participants: dm.participants,
      };
    } else {
      const participant = dm.participants.find(
        (p) => p._id.toString() !== userId,
      );

      const [user, other] = await Promise.all([
        this.userService.findOne({ _id: userId }),
        this.userService.findOne({ _id: participant._id }),
      ]);

      const mutualFriendsIds = user?.friends.filter(
        (friendId: Types.ObjectId) =>
          other?.friends.some(
            (otherId: Types.ObjectId) =>
              otherId.toString() === friendId.toString(),
          ),
      );
      const mutualFriends = await this.userService.find({
        _id: { $in: mutualFriendsIds },
      });

      // LATER
      // const mutualServers = await this.serverModel.find({
      //   members: { $all: [userId, other._id] },
      // });

      return {
        id: dm._id,
        type: 'one-on-one',
        participant: other,
        mutualFriends,
        // mutualServers,
      };
    }
  }
}
