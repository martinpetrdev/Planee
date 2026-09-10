import { registerAs } from '@nestjs/config';

// Globally exported (skips nestjs config service) because it is used in entrypoint.
// TODO: Improve code quality of this
/**
 * Returns the port on which the REST API should listen on.
 * Read from `CONF_API_HTTP_PORT` environment variable. Throws an error if invalid.
 */
export function getServicePort(): number {
  const port: number = Number(process.env.CONF_API_HTTP_PORT ?? '-1');

  // Validation (number, valid port range)
  if (
    typeof port != 'number' ||
    !Number.isInteger(port) ||
    port < 0 ||
    port > 65535
  )
    throw new Error('Invalid HTTP_PORT set!');

  return port;
}

// Globally exported (skips nestjs config service) because it is used in entrypoint.
// TODO: Improve code quality of this
/**
 * Returns array of allowed origins for CORS config.
 * Read from `CONF_API_HTTP_CORS_ORIGINS` (comma-separated) environment variable. If not set, returns empty array.
 */
export function getServiceCorsAllowedOrigins(): string[] {
  return process.env.CONF_API_HTTP_CORS_ORIGINS?.split(',') ?? [];
}

export default registerAs('http', () => ({
  port: getServicePort(),
  cors: {
    allowedOrigins: getServiceCorsAllowedOrigins(),
  },
}));
