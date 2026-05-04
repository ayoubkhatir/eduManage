import { databaseErrorResponse, internalServerErrorResponse, type APIResponse, type DatabaseErrorCode } from "./response.type";

function isDbError(
    error: unknown,
): error is { code?: string; constraint?: string; detail?: string; message?: string } {
    return typeof error === 'object' && error !== null
}

export function mapDbError<T>(error: unknown): APIResponse<T> {
    if (isDbError(error)) {
        // switch (error.code) {
        // case '23505':
        return databaseErrorResponse((error.code ?? "22001") as DatabaseErrorCode, `message: ${error.message} | constraint:${error.constraint}`) as APIResponse<T>

        // case '23503':
        //     return {
        //         ok: false,
        //         code: error.code,
        //         message: 'Related record not found. The school or user reference is invalid.',
        //     }

        // case '23502':
        //     return {
        //         ok: false,
        //         code: error.code,
        //         message: 'A required field is missing.',
        //     }

        // case '22001':
        //     return {
        //         ok: false,
        //         code: error.code,
        //         message: 'One of the provided values is too long.',
        //     }

        // default:
        //     return {
        //         ok: false,
        //         code: error.code,
        //         message: error.message ?? 'Database error occurred.',
        //     }
        // }
    }

    return internalServerErrorResponse()
}
