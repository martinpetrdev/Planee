import {
	createParamDecorator,
	type ExecutionContext,
	UnauthorizedException,
} from "@nestjs/common";
import type { AuthenticatedUser } from "#auth/domain/authenticated-user";

export function getUser(context: ExecutionContext): AuthenticatedUser | null {
	if (context.getType<string>() === "mcp")
		return (context as any).args?.[1].authInfo?.extra?.user;

	return context.switchToHttp().getRequest().user ?? null;
}

export const User = createParamDecorator(
	<K extends keyof AuthenticatedUser>(key: K, context: ExecutionContext) => {
		const user = getUser(context);

		// Ensure that the user is present, in case guard is missing/skips auth
		if (!user) throw new UnauthorizedException("User not authenticated");

		return key ? user[key] : user;
	},
);
