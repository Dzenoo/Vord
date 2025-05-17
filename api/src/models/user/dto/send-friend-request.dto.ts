import {
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { nameRegex } from '@/common/constants';

export class SendFriendRequestDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  @MaxLength(15)
  @Matches(nameRegex, {
    message: 'Please enter valid username!',
  })
  username: string;
}
