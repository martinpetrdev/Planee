import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class EapJoinDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  inviteId: string;

  @IsEmail()
  @IsNotEmpty()
  @ApiProperty()
  email: string;
}
