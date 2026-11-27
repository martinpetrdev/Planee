import { applyDecorators } from "@nestjs/common";
import { ApiForbiddenResponse, ApiUnauthorizedResponse } from "@nestjs/swagger";
import { z } from "zod";

const nestErrorSchema = (statusCode: number, statusName: string) =>
	z.object({
		message: z.string(),
		error: z.literal(statusName),
		statusCode: z.literal(statusCode),
	});

export const ApiAuthErrorResponses = () =>
	applyDecorators(
		ApiUnauthorizedResponse({
			description: "Missing or invalid authentication JWT",
			standardSchema: nestErrorSchema(401, "Unauthorized"),
		}),
		ApiForbiddenResponse({
			description: "Not available for this user",
			standardSchema: nestErrorSchema(403, "Forbidden"),
		}),
	);
