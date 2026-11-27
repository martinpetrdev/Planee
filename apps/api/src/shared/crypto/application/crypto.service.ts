import { Injectable } from '@nestjs/common';

import { CryptoServicePort } from '../ports/crypto-service.port.ts';
import { createHash, randomBytes } from 'node:crypto';

@Injectable()
export class CryptoService extends CryptoServicePort {
  hash(data: string): Uint8Array<ArrayBuffer> {
    return createHash('sha256').update(data).digest();
  }

  generateRandomString(bytes: number): string {
    return randomBytes(bytes).toString('base64url');
  }
}
