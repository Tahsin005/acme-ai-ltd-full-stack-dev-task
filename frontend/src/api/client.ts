import type { ApiResponse, ErrorResponse } from "../types/task.js";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

export class ApiError extends Error {
  statusCode: number;
  errors?: ErrorResponse["errors"];

  constructor(statusCode: number, message: string, errors?: ErrorResponse["errors"]) {
    super(message);
    this.name = "ApiError";
    this.statusCode = statusCode;
    this.errors = errors;
  }
}

interface RequestOptions extends Omit<RequestInit, "body"> {
  body?: unknown;
}

export async function apiClient<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const { body, headers, ...customConfig } = options;

  const config: RequestInit = {
    ...customConfig,
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
  };

  if (body !== undefined) {
    config.body = JSON.stringify(body);
  }

  const url = `${BASE_URL.replace(/\/+$/, "")}/${endpoint.replace(/^\/+/, "")}`;
  const response = await fetch(url, config);
  const data: ApiResponse<T> = await response.json();

  if (!response.ok || !data.success) {
    const errorData = data as ErrorResponse;
    throw new ApiError(
      response.status,
      errorData.message || "An unexpected error occurred",
      errorData.errors
    );
  }

  return data.data;
}
