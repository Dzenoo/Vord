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

  @Post('friends/manage-request/:senderId/:state')
  @UseGuards(JwtAuthGuard)
  async manageFriendRequest(
    @User('userId') userId: string,
    @Param('senderId') senderId: string,
    @Param('state') state: 'accept' | 'reject',
  ) {
    return await this.userService.manageFriendRequest(userId, senderId, state);
  }

  @Get('friends/all-friends')
  @UseGuards(JwtAuthGuard)
  async getAllFriends(
    @User('userId') userId: string,
    @Query() query: GetFriendsDto,
  ) {
    return await this.userService.getAllFriends(userId, query);
  }

  @Patch('friends/remove-friend/:friendId')
  @UseGuards(JwtAuthGuard)
  async removeFriend(
    @User('userId') userId: string,
    @Param('friendId') friendId: string,
  ) {
    return await this.userService.removeFriend(userId, friendId);
  }
}
