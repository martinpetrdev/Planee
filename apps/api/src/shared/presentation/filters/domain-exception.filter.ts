import {
  ArgumentsHost,
  Catch,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { DomainError, DomainErrorKind } from '../../domain/domain.error.js';
import { BaseExceptionFilter } from '@nestjs/core';

const STATUS_CODES: Record<DomainErrorKind, HttpStatus> = {
  'not-found': HttpStatus.NOT_FOUND,
  invalid: HttpStatus.BAD_REQUEST,
  conflict: HttpStatus.CONFLICT,
  forbidden: HttpStatus.FORBIDDEN,
};

@Catch(DomainError)
export class DomainExceptionFilter extends BaseExceptionFilter {
  catch(exception: DomainError, host: ArgumentsHost) {
    super.catch(
      new HttpException(exception.message, STATUS_CODES[exception.kind], {
        cause: exception,
      }),
      host,
    );
  }
}
