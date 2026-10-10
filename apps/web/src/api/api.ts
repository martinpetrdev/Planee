import { API } from "@repo/shared";

import { apiConnector } from "@/api/connector";

// Creates a singleton from our api connector instance
export const api = new API(apiConnector);
