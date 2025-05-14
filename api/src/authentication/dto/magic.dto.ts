import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

export class MagicRequestDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;
}

export class MagicVerifyDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @Length(6, 6)
  code: string;
}
