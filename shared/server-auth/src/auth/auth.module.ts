import { type DynamicModule, Module } from "@nestjs/common";
import { APP_GUARD } from "@nestjs/core";
import { KeycloakJwtVerifier } from "./infrastructure/keycloak.jwt-verifier.ts";
import { JwtVerifierPort } from "./ports/jwt-verifier.port.ts";
import { AuthGuard } from "./presentation/guards/auth.guard.ts";

interface IAuthModuleOptions {
	oidc: {
		issuer: string;
		audience: string;
	};
}

@Module({})
// biome-ignore lint/complexity/noStaticOnlyClass: NestJS dynamic module
export class AuthModule {
	static forRoot(options: IAuthModuleOptions): DynamicModule {
		return {
			global: true,
			module: AuthModule,
			providers: [
				{
					provide: JwtVerifierPort,
					useFactory: () =>
						new KeycloakJwtVerifier(options.oidc.issuer, options.oidc.audience),
				},
				{
					provide: APP_GUARD,
					useClass: AuthGuard,
				},
			],
		};
	}
}
