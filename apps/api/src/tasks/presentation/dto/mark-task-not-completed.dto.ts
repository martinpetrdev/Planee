import { z } from 'zod';

export const MarkTaskNotCompletedMCPSchema = z.object({
  id: z.ulid().describe('ID of the task to mark as not completed'),
});
