import type { z } from "zod";

export interface SuccessResponse<T> {
    success: true;
    data: T;
    message: string;
}

export interface ErrorResponse {
    success: false;
    message: string;
    errors?: z.core.$ZodIssue[];
}

export type ApiResponse<T> = SuccessResponse<T> | ErrorResponse;

export function successResponse<T>(data: T, message = "Success"): SuccessResponse<T> {
    return {
        success: true,
        data,
        message,
    };
}

export function errorResponse(message: string, errors?: z.core.$ZodIssue[]): ErrorResponse {
    return {
        success: false,
        message,
        ...(errors && { errors }),
    };
}