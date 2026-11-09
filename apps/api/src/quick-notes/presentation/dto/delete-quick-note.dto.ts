import {z} from "zod";

export const DeleteQuickNoteMCPSchema = z.object({
  id: z.ulid()
})