import { z } from 'zod';

export const DeleteTaskMCPSchema = z.object({
  id: z.ulid().describe('ID of the task to delete'),
});
