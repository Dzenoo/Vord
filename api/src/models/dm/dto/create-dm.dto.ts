import {
  ArrayMinSize,
  IsArray,
  IsMongoId,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateGroupDmDto {
  @IsArray()
  @ArrayMinSize(2, {
    message: 'Group DMs require at least 3 participants (including yourself)',
  })
  @IsMongoId({ each: true })
  readonly participants: string[];

  @IsOptional()
  @IsString()
  readonly name?: string;

  @IsOptional()
  @IsString()
  readonly icon?: string;
}

export class CreateOneOnOneDmDto {
  @IsMongoId()
  readonly userA: string;

  @IsMongoId()
  readonly userB: string;
}
