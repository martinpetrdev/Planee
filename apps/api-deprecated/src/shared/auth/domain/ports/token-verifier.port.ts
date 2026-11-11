import { AuthenticatedUser } from '../authenticated-user.entity.js';

export abstract class TokenVerifierPort {
  abstract verify(token: string): Promise<AuthenticatedUser>;
}
