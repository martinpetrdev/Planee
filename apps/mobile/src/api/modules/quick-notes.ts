import { ApiVersion } from '@repo/shared';

import { api } from '@/api/api';

const BASE_PATH = '/quick-notes';

export interface QuickNoteResponseDto {
  id: string;
  text: string;
}

export interface CreateQuickNoteDto {
  text: string;
}

export const createQuickNote = (dto: CreateQuickNoteDto) =>
  api.post<QuickNoteResponseDto, CreateQuickNoteDto>(
    ApiVersion.v1,
    BASE_PATH,
    dto,
  );

export const listQuickNotes = () =>
  api.get<QuickNoteResponseDto[]>(ApiVersion.v1, BASE_PATH);
