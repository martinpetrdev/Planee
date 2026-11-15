import { z } from 'zod';

import { CreateTaskDto, CreateTaskMCPSchema } from './create-task.dto.js';

export class UpdateTaskDto extends CreateTaskDto {}

export const UpdateTaskMCPSchema = CreateTaskMCPSchema.omit({
  quickNoteId: true,
}).extend({
  id: z.ulid().describe('ID of the task to update'),
});
