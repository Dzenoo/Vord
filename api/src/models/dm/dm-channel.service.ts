import { Model, Types } from 'mongoose';
import {
  ConflictException,
  HttpStatus,
  Injectable,
  NotAcceptableException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { DmChannel } from './schema/dm-channel.schema';
import { CreateGroupDmDto, CreateOneOnOneDmDto } from './dto/create-dm.dto';
import { UserService } from '../user/user.service';

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
      status: HttpStatus.CREATED,
      data: { dm },
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
}
