import z from "zod";
import { paginationQueriesSchema } from "#/schemas/shared.schema";



export type PaginationData<T> = {
    data: Array<T>
    rowCount: number
}

export type PaginationQueriesSchema = z.infer<typeof paginationQueriesSchema>;