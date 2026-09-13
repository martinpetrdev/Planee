import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { TokenVerifierPort } from '../../domain/ports/token-verifier.port.js';
import { Reflector } from '@nestjs/core';
import {
  isPublic,
  PUBLIC_DECORATOR_KEY,
} from '../../presentation/decorators/public.decorator.js';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly verifier: TokenVerifierPort,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    if (isPublic(this.reflector, context)) return true;

    const req = context.switchToHttp().getRequest();
    const [scheme, token] = (req.headers.authorization ?? '').split(' ');
    if ((scheme as string)?.toLowerCase() !== 'bearer' || !token)
      throw new UnauthorizedException();

    req.user = await this.verifier.verify(token);

    return true;
  }
}
