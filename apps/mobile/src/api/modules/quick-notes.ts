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

export interface UpdateQuickNoteDto extends CreateQuickNoteDto {}

export const createQuickNote = (dto: CreateQuickNoteDto) =>
  api.post<QuickNoteResponseDto, CreateQuickNoteDto>(
    ApiVersion.v1,
    BASE_PATH,
    dto,
  );

export const listQuickNotes = () =>
  api.get<QuickNoteResponseDto[]>(ApiVersion.v1, BASE_PATH);

export const updateQuickNote = (id: string, dto: UpdateQuickNoteDto) =>
  api.put<QuickNoteResponseDto, UpdateQuickNoteDto>(
    ApiVersion.v1,
    `${BASE_PATH}/${id}`,
    dto,
  );

export const deleteQuickNote = (id: string) =>
  api.delete<object, object>(ApiVersion.v1, `${BASE_PATH}/${id}`);
