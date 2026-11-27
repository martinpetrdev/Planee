import { ValidationException } from '../../../shared/exceptions/validation.exception.ts';

export class McpKeyValidator {
  public static validateName(name: string) {
    if (name.trim().length < 3 || name.trim().length > 64)
      throw new ValidationException({
        name: 'Name must be between 3 and 64 characters long',
      });
  }
}
