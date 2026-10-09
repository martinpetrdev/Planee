import { EapInvite } from '../../../domain/EapInvite.js';

export abstract class EapInviteRepositoryPort {
  abstract generate(): Promise<EapInvite>;
  abstract findById(id: string): Promise<EapInvite | null>;
  abstract delete(invite: EapInvite): Promise<boolean>;
}
