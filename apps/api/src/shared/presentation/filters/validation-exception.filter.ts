import {
  ArgumentsHost,
  Catch,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { ValidationError } from '../../domain/validation.error.js';
import { capitalizeFirstLetter } from '../../../utils/text.js';

@Catch(ValidationError)
export class ValidationExceptionFilter extends BaseExceptionFilter {
  catch(exception: ValidationError, host: ArgumentsHost) {
    super.catch(
      new HttpException(
        {
          message: exception.message,
          statusCode: HttpStatus.BAD_REQUEST,
          fields: Object.fromEntries(
            Object.entries(exception.fieldErrors).map(([k, v]) => [
              k,
              capitalizeFirstLetter(v.replace(k, '').trim()),
            ]),
          ),
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
