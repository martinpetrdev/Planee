import { registerAs } from '@nestjs/config';

// Globally exported (skips nestjs config service) because it is used in entrypoint.
// TODO: Improve code quality of this
/**
 * Port on which the REST API should listen on.
 */
export const HTTP_PORT: number = Number(process.env.CONF_API_HTTP_PORT ?? '-1');
// Validation (number, valid port range)
if (
  typeof HTTP_PORT != 'number' ||
  !Number.isInteger(HTTP_PORT) ||
  HTTP_PORT < 0 ||
  HTTP_PORT > 65535
)
  throw new Error('Invalid HTTP_PORT set!');

export default registerAs('http', () => ({
  port: process.env.HTTP_PORT,
}));
