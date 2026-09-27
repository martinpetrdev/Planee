import { ApiVersion } from '@repo/shared';

import { api } from '../api';

const BASE_PATH = '/events';

export const eventsStream = () => api.sse(ApiVersion.v1, BASE_PATH);
