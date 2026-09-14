import { oidcClient } from "@/auth/oidc";
import { API_BASE } from "@/configuration/api";
import axios from "axios";

export const apiConnector = axios.create({
  baseURL: API_BASE,
  headers: {
    "content-type": "application/json",
    accept: "application/json",
  },
});

apiConnector.interceptors.request.use(async (req) => {
  const token = await oidcClient.getToken();
  req.headers["Authorization"] = token ? "Bearer " + token : "";

  return req;
});
