import { Configuration } from "@repo-shared/configuration";

export const ApplicationConfig = new Configuration({
  ...JSON.parse(process.env.APPLICATION_CONFIG!),
  "database.url": process.env.DATABASE_URL!,
  "redis.url": process.env.REDIS_URL!,
}).getObject();
