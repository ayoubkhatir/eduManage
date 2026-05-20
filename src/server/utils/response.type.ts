
import z, { ZodError } from "zod/v4"

interface SuccessResponse<T> {
    success: true,
    message: string,
    data: T
}



export type ApiResponse<T> = SuccessResponse<T> | ErrorResponse

export enum ErrorTypes {
    VALIDATION_ERROR = 'VALIDATION_ERROR',
    HTTP_ERROR = 'HTTP_ERROR',
    INTERNAL_SERVER_ERROR = 'INTERNAL_SERVER_ERROR',
    DATABASE_ERROR = "DATABASE_ERROR"
}

export interface ErrorResponse {
    success: false,
}

type ValidationErrorResponse = ErrorResponse & {
    errorType: ErrorTypes.VALIDATION_ERROR,
    issues: string[],
    code: null
}

type HTTPErrorResponse = ErrorResponse & {
    errorType: ErrorTypes.HTTP_ERROR,
    message: string,
    code: null
}

type InternalServerErrorResponse = ErrorResponse & {
    errorType: ErrorTypes.INTERNAL_SERVER_ERROR,
    message: string,
    code: null
}

export type DatabaseErrorCode = '23505' | '23503' | '23502' | '22001'
type DatabaseErrorResponse = ErrorResponse & {
    errorType: ErrorTypes.DATABASE_ERROR,
    code: DatabaseErrorCode,
    message: string
}

interface Pagination {
    totalCount: number,
    totalPages: number
}

interface PaginatedSuccessResponse<T> {
    success: true,
    message: string,
    data: T,
    pagination: Pagination
}

export type APIErrorResponses = | DatabaseErrorResponse | ValidationErrorResponse | HTTPErrorResponse | InternalServerErrorResponse

export type APIResponse<T> = SuccessResponse<T> | APIErrorResponses

export type PaginatedAPIResponse<T> = PaginatedSuccessResponse<T> | APIErrorResponses

export function successResponse<T>(data: T, message: string = "Success"): APIResponse<T> {
    return {
        success: true,
        message,
        data
    }
}


export function validationErrorResponse<T>(error: ZodError): APIResponse<T> {
    return {
        success: false,
        errorType: ErrorTypes.VALIDATION_ERROR,
        issues: z.treeifyError(error).errors,
        code: null
    }
}

export function internalServerErrorResponse<T>(): APIResponse<T> {
    return {
        success: false,
        errorType: ErrorTypes.INTERNAL_SERVER_ERROR,
        message: "Something went wrong on the server.",
        code: null
    }
}

export function httpExceptionResponse<T>(message: string): APIResponse<T> {
    return {
        success: false,
        errorType: ErrorTypes.HTTP_ERROR,
        message,
        code: null
    }
}

export function databaseErrorResponse<T>(code: DatabaseErrorCode, message: string) {
    return {
        errorType: ErrorTypes.DATABASE_ERROR,
        success: false,
        message,
        code
    } as ApiResponse<T>
}

export function paginatedSuccessResponse<T>(data: T, pagination: Pagination, message: string = "Success"): PaginatedSuccessResponse<T> {
    return {
        success: true,
        message,
        data,
        pagination
    }
}


// export function paginatedErrorResponse<T>(error: string): PaginatedAPIResponse<T> {
//     return {
//         success: false,
//         error
//     }
// }
