import { type ExecutionContext, SetMetadata } from "@nestjs/common";
import type { Reflector } from "@nestjs/core";

export const SKIP_AUTH_DECORATOR_KEY = Symbol("SkipAuth");

export const SkipAuth = () => SetMetadata(SKIP_AUTH_DECORATOR_KEY, true);

export function isSkipAuthDecorated(
	reflector: Reflector,
	context: ExecutionContext,
) {
	return (
		reflector.getAllAndOverride<boolean>(SKIP_AUTH_DECORATOR_KEY, [
			context.getHandler(),
			context.getClass(),
		]) ?? false
	);
}
