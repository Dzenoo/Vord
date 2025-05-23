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

  async createOneOnOneDm(body: CreateOneOnOneDmDto) {
    if (body.userA === body.userB) {
      throw new NotAcceptableException('Cannot create DM with yourself.');
    }

    const users = await this.userService.find({
      _id: { $in: [body.userA, body.userB] },
    });

    if (users.length !== 2) {
      throw new NotAcceptableException('One or more users do not exist.');
    }

    const [firstId, secondId] = [body.userA, body.userB].map(String).sort();

    let dm = await this.dmChannelModel.findOne({
      participants: { $size: 2, $all: [firstId, secondId] },
    });

    if (!dm) {
      dm = await this.dmChannelModel.create({
        participants: [firstId, secondId],
      });
      await this.userService.findAndUpdateMany(
        { _id: { $in: [firstId, secondId] } },
        { $addToSet: { directMessages: dm._id } },
      );
    }

    return { status: HttpStatus.ACCEPTED, data: { dm } };
  }

  async createGroupDm(creatorId: string, dto: CreateGroupDmDto) {
    if (dto.participants.length < 2) {
      throw new NotAcceptableException(
        'Group DMs require at least 3 participants (including yourself)',
      );
    }

    const participants = Array.from(
      new Set([creatorId, ...dto.participants.map(String)]),
    ).map((id) => new Types.ObjectId(id));

    const exists = await this.dmChannelModel.findOne({
      participants: { $all: participants, $size: participants.length },
    });

    if (exists) {
      throw new ConflictException(
        'A group with these participants already exists.',
      );
    }

    const group = await this.dmChannelModel.create({
      participants,
      creator: creatorId,
      name: dto.name ?? null,
      icon: dto.icon ?? null,
    });

    await this.userService.findAndUpdateMany(
      { _id: { $in: participants } },
      { $addToSet: { directMessages: group._id } },
    );

    return { status: HttpStatus.CREATED, data: { group } };
  }

  async getUserDms(userId: string, query: GetDmsDto) {
    const { page = 1, limit = 15 } = query;

    const dms = await this.dmChannelModel
      .find({ participants: userId })
      .populate('participants')
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    const data = await Promise.all(
      dms.map((dm) => this.buildDmView(dm, userId)),
    );

    return { data, meta: { count: data.length, page, limit } };
  }

  async getDmDetails(dmId: string, userId: string) {
    const dm = await this.dmChannelModel
      .findById(dmId)
      .populate('participants')
      .lean();

    if (!dm || !dm.participants.some((p) => p._id.toString() === userId)) {
      throw new NotFoundException('DM not found or you are not a participant');
    }

    return await this.buildDmView(dm, userId);
  }

  private async buildDmView(dm: any, userId: string) {
    const isGroup = dm.participants.length > 2;

    if (isGroup) {
      return {
        id: dm._id,
        type: 'group',
        name: dm.name,
        icon: dm.icon,
        participants: dm.participants,
      };
    }

    const other = dm.participants.find((p) => p._id.toString() !== userId);

    const [user, otherUser] = await Promise.all([
      this.userService.findOne({ _id: userId }),
      this.userService.findOne({ _id: other._id }),
    ]);

    const mutualFriendsIds = user?.friends.filter((id: Types.ObjectId) =>
      otherUser?.friends.some(
        (fid: Types.ObjectId) => fid.toString() === id.toString(),
      ),
    );

    const mutualFriends = await this.userService.find({
      _id: { $in: mutualFriendsIds },
    });

    return {
      id: dm._id,
      type: 'one-on-one',
      participant: otherUser,
      mutualFriends,
    };
  }
}
