import { CreateQuickNoteDto, CreateQuickNoteMCPSchema} from './create-quick-note.dto.js';
import {z} from "zod";

export class UpdateQuickNoteDto extends CreateQuickNoteDto {}

export const UpdateQuickNoteMCPSchema = CreateQuickNoteMCPSchema.extend({
  id: z.ulid()
})