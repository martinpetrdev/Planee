import { EapInvite } from '../../../domain/EapInvite.ts';

export class EapInviteResponseDto {
  id: string;

  constructor(data: EapInviteResponseDto) {
    Object.assign(this, data);
  }

  static fromDomain(eapInvite: EapInvite): EapInviteResponseDto {
    return new EapInviteResponseDto(eapInvite.toObject());
  }
}
