import { applyDecorators } from '@nestjs/common';
import { ApiForbiddenResponse, ApiUnauthorizedResponse } from '@nestjs/swagger';

export const ApiAuthResponses = () =>
  applyDecorators(
    ApiUnauthorizedResponse({ description: 'Missing or invalid auth token' }),
    ApiForbiddenResponse({ description: 'Not available for this user' }),
  );
