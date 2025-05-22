import { Body, Controller, Post, UseGuards } from '@nestjs/common';

import { DmChannelService } from './dm-channel.service';
import { CreateGroupDmDto, CreateOneOnOneDmDto } from './dto/create-dm.dto';

import { JwtAuthGuard } from '@/authentication/guards/jwt-auth.guard';
import { User } from '@/common/decorators/user.decorator';

@Controller('dm')
export class DmChannelController {
  constructor(private readonly dmChannelService: DmChannelService) {}

  @Post('create/one-on-one')
  @UseGuards(JwtAuthGuard)
  async createOneOnOne(@Body() body: CreateOneOnOneDmDto) {
    return await this.dmChannelService.createOneOnOne(body);
  }

  @Post('create/group')
  @UseGuards(JwtAuthGuard)
  async createGroup(
    @User('userId') userId: string,
    @Body() body: CreateGroupDmDto,
  ) {
    return await this.dmChannelService.createGroup(userId, body);
  }
}
