import { Global, Module } from '@nestjs/common';

import { CryptoService } from './application/crypto.service.ts';
import { CryptoServicePort } from './ports/crypto-service.port.ts';

@Global()
@Module({
  providers: [
    {
      provide: CryptoServicePort,
      useClass: CryptoService,
    },
  ],
  exports: [CryptoServicePort],
})
export class CryptoModule {}
