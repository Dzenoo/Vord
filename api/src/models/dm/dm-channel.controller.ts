import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';

import { DmChannelService } from './dm-channel.service';
import { CreateGroupDmDto, CreateOneOnOneDmDto } from './dto/create-dm.dto';
import { GetDmsDto } from './dto/get-dms.dto';

import { JwtAuthGuard } from '@/authentication/guards/jwt-auth.guard';
import { User } from '@/common/decorators/user.decorator';

@Controller('dm')
export class DmChannelController {
  constructor(private readonly dmChannelService: DmChannelService) {}

  @Post('create/one-on-one')
  @UseGuards(JwtAuthGuard)
  async createOneOnOneDm(@Body() body: CreateOneOnOneDmDto) {
    return await this.dmChannelService.createOneOnOneDm(body);
  }

  @Post('create/group')
  @UseGuards(JwtAuthGuard)
  async createGroupDm(
    @User('userId') userId: string,
    @Body() body: CreateGroupDmDto,
  ) {
    return await this.dmChannelService.createGroupDm(userId, body);
  }

  @Get('list')
  @UseGuards(JwtAuthGuard)
  async getUserDms(@User('userId') userId: string, @Query() query: GetDmsDto) {
    return await this.dmChannelService.getUserDms(userId, query);
  }

  @Get(':dmId/details')
  @UseGuards(JwtAuthGuard)
  async getDmDetails(
    @User('userId') userId: string,
    @Param('dmId') dmId: string,
  ) {
    return await this.dmChannelService.getDmDetails(dmId, userId);
  }
}
