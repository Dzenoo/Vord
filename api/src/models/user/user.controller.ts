import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';

import { Request } from 'express';

import { UserService } from './user.service';

import { SendFriendRequestDto } from './dto/send-friend-request.dto';
import { GetFriendsDto } from './dto/get-friends.dto';

import { User } from '@/common/decorators/user.decorator';
import { JwtAuthGuard } from '@/authentication/guards/jwt-auth.guard';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async getCurrentUser(@Req() request: Request) {
    const user = request.user;
    if (!user) throw new UnauthorizedException('Unauthorized!');
    return { user };
  }

  @Post('friends/send-request')
  @UseGuards(JwtAuthGuard)
  async sendFriendRequest(
    @User('userId') userId: string,
    @Body() body: SendFriendRequestDto,
  ) {
    return await this.userService.sendFriendRequest(userId, body);
  }

  @Post('friends/manage-request/:state')
  async manageFriendRequest(@Param('state') state: 'accept' | 'reject') {}

  @Get('friends/all-friends')
  async getAllFriends(@Query() query: GetFriendsDto) {}

  @Patch('friends/remove-friend/:userId')
  async removeFriend(@Param('userId') userId: string) {}
}
