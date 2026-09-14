import { PrismaClient } from "./generated/client.ts";
import { PrismaPg } from "@prisma/adapter-pg";
export * from "./generated/client.ts";

export const prisma = new PrismaClient({
  adapter: new PrismaPg({
    connectionString: process.env.DATABASE_URL,
  }),
});
