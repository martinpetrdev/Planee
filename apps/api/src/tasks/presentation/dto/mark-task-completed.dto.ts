import { z } from 'zod';

export const MarkTaskCompletedMCPSchema = z.object({
  id: z.ulid().describe('ID of the task to mark as completed'),
});
