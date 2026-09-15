import { AxiosInstance } from "axios";
import { ApiVersion } from "@repo/shared";
import { secios, SeciosInstance } from "secios";
import { apiConnector } from "./connector";

/**
 * API error response, that is emitted from rejection.
 */
export interface APIError {
  statusCode: number;
  error: string;
  message: string;
}

/**
 * Extended axios instance wrapper to provide a more convenient interface for making API requests.
 */
export class API {
  private readonly seciosInstance: SeciosInstance;

  constructor(private readonly apiConnector: AxiosInstance) {
    this.seciosInstance = secios.create(apiConnector);
  }

  /**
   * Does a GET request to the specified path and returns the response data or rejects.
   */
  public async get<T>(version: ApiVersion, path: string): Promise<T> {
    const res = await this.apiConnector.get<T>(this.buildUrl(version, path));
    return res.data;
  }

  /**
   * Does a POST request to the specified path with the specified body and returns the response data or rejects.
   */
  public async post<T, B>(
    version: ApiVersion,
    path: string,
    body: B,
  ): Promise<T> {
    const res = await this.apiConnector.post<T>(
      this.buildUrl(version, path),
      body,
    );
    return res.data;
  }

  /**
   * Does a PUT request to the specified path with the specified body and returns the response data or rejects.
   */
  public async put<T, B>(
    version: ApiVersion,
    path: string,
    body: B,
  ): Promise<T> {
    const res = await this.apiConnector.put<T>(
      this.buildUrl(version, path),
      body,
    );
    return res.data;
  }

  /**
   * Does a PATCH request to the specified path with the specified body and returns the response data or rejects.
   */
  public async patch<T, B>(
    version: ApiVersion,
    path: string,
    body: B,
  ): Promise<T> {
    const res = await this.apiConnector.patch<T>(
      this.buildUrl(version, path),
      body,
    );
    return res.data;
  }

  /**
   * Does a DELETE request to the specified path and returns the response data or rejects.
   */
  public async delete<T>(version: ApiVersion, path: string): Promise<T> {
    const res = await this.apiConnector.delete<T>(this.buildUrl(version, path));
    return res.data;
  }

  /**
   * Opens an SSE connection to the specified path (headers are included).
   */
  public async sse(version: ApiVersion, path: string) {
    return await this.seciosInstance.connect(this.buildUrl(version, path));
  }

  /**
   * Builds the full URL path (axios adds that to the base URL) for the specified version and path.
   */
  private buildUrl(version: ApiVersion, path: string): string {
    return `/v${version}${path.startsWith("/") ? "" : "/"}${path}`;
  }
}

// Creates a singleton from our api connector instance
export const api = new API(apiConnector);
