// @ai/created(Claude Fable 5.2): Wrote the Prisma config pointing at the split schema folder and DATABASE_URL.

import * as process from "node:process";
import { defineConfig } from "prisma/config";

export default defineConfig({
	schema: "prisma/",
	datasource: {
		url: process.env.DATABASE_URL,
	},
});
