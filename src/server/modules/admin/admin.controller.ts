import type { NewInfoOwnerFields } from "#/components/settings/admin/settings.schema";
import { db, type Database } from "#/server/db/db";
import { adminsTable, users } from "#/server/db/schema";
import { eq } from "drizzle-orm";


class AdminController {
    constructor(private readonly db: Database) { }

    async editAdmin(data: NewInfoOwnerFields) {
        const {
            teacherNotifications,
            schoolAnnouncements,
            sharedCalendar,
            paymentsModule,
            ...dbData
        } = data

        const foundAdmin = await this.db.query.adminsTable.findFirst({
            where: eq(adminsTable.id, dbData.id),
            columns: { userId: true }
        });
        if (!foundAdmin) throw new Error("Admin not found");
        const userId = foundAdmin.userId;

        await this.db
            .update(users)
            .set({
                email: dbData.email,
                name: dbData.name,
                image: dbData.image,
                telNumber: dbData.phoneNumber,
                gender: dbData.gender,
            })
            .where(eq(users.id, userId))
            .returning()

        await this.db
            .update(adminsTable)
            .set({
                schoolName: dbData.SchoolName,
            })
            .where(eq(adminsTable.id, dbData.id))
            .returning()
    }

    
}



export const adminController = new AdminController(db)