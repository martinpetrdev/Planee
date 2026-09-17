import { IsString, Matches, MaxLength } from 'class-validator';

export class PushTokenDto {
  @IsString()
  @MaxLength(255)
  @Matches(/^ExponentPushToken\[[^\]]+\]$/, {
    message: 'Push token must be a valid Expo push token',
  })
  token: string;
}
