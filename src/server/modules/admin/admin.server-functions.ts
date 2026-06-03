import { newInfoOwnerSchema } from "#/components/settings/admin/settings.schema";
import { createServerFn } from "@tanstack/react-start";
import { adminController } from "./admin.controller";
import { successResponse, type APIErrorResponses, type APIResponse } from "#/server/utils/response.type";
import { mapDbError } from "#/server/utils/db_error_handling";

export const updateAdminServerFn = createServerFn({ method: 'POST' })
    .inputValidator(newInfoOwnerSchema)
    .handler(async ({ data }) => {
        try {
            const body = await adminController.editAdmin(data)
            return successResponse(body) as APIResponse<typeof body>
        }
        catch (error) {
            console.log("\x1b[36m[server]\x1b[0m " + error)
            return mapDbError(error) as APIErrorResponses
        }
    })
