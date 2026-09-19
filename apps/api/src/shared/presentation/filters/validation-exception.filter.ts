import {
  ArgumentsHost,
  Catch,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { ValidationError } from '../../domain/validation.error.js';

@Catch(ValidationError)
export class ValidationExceptionFilter extends BaseExceptionFilter {
  catch(exception: ValidationError, host: ArgumentsHost) {
    super.catch(
      new HttpException(
        {
          message: exception.message,
          statusCode: HttpStatus.BAD_REQUEST,
          fields: exception.fieldErrors,
        },
        HttpStatus.BAD_REQUEST,
        {
          cause: exception,
        },
      ),
      host,
    );
  }
}
