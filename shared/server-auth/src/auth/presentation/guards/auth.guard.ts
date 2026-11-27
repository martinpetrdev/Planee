import {
	type CanActivate,
	Dependencies,
	type ExecutionContext,
	Injectable,
	UnauthorizedException,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { JwtVerifierPort } from "#auth/ports/jwt-verifier.port";
import { UserProvisionerPort } from "#auth/ports/user-provisioner.port";
import { isSkipAuthDecorated } from "#auth/presentation/decorators/skip-auth.decorator";

// TODO: This and actual implementation + port are split between this package and api package, improve this

@Dependencies(Reflector, JwtVerifierPort, UserProvisionerPort)
@Injectable()
export class AuthGuard implements CanActivate {
	constructor(
		private readonly reflector: Reflector,
		private readonly jwtVerifier: JwtVerifierPort,
		private readonly userProvisioner: UserProvisionerPort,
	) {}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		if (isSkipAuthDecorated(this.reflector, context)) return true;
		if (context.getType<string>() === "mcp") return true; // MCP calls are always authenticated when they reach this guard

		const request = context.switchToHttp().getRequest();

		// Validate that the token is Bearer typed and is present
		const [type, token] = (
			(request.headers.authorization as string) ?? ""
		).split(" ");

		if (type?.toLowerCase() !== "bearer" || !token)
			throw new UnauthorizedException("Malformed authentication headers");

		// Verify the token, extract payload and provision the user
		request.user = await this.jwtVerifier.verify(token);
		await this.userProvisioner.provision(request.user);

		return true;
	}
}
