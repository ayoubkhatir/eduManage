import "dotenv/config";
import { db } from "#/server/db/db";
import * as schema from "#/server/db/schema";
import { faker } from "@faker-js/faker";
import { passwordHasher } from "#/server/modules/auth/services/password_hasher.service";

faker.seed(999);

const SCHOOL_NAME = "El Maarifa School";

async function main() {
    console.log("➕ Adding one student and one teacher...\n");

    try {
        // Get or create the first school (admin)
        let school = await db.query.adminsTable.findFirst();
        
        if (!school) {
            console.log("📚 No school found. Creating a new school...");
            
            // Create admin user
            const passwordHash = await passwordHasher.hashPassword("admin123");
            const [adminUser] = await db
                .insert(schema.users)
                .values({
                    email: "admin@school.test",
                    emailVerified: true,
                    name: "Admin User",
                    gender: schema.UserGenderEnum.MALE,
                    role: schema.UserRoleEnum.ADMIN,
                    telNumber: "+213555000000",
                    image: faker.image.avatar(),
                })
                .returning();

            const [newSchool] = await db
                .insert(schema.adminsTable)
                .values({
                    userId: adminUser.id,
                    schoolName: SCHOOL_NAME,
                    numberStudents: 0,
                    numberTeachers: 0,
                })
                .returning();

            school = newSchool;
            console.log(`✅ School created: ${school.schoolName}\n`);
        } else {
            console.log(`✅ Using existing school: ${school.schoolName}\n`);
        }

        // Get or create the first class for the student
        let firstClass = await db.query.classesTable.findFirst({
            where: (classes, { eq }) => eq(classes.schoolId, school.id),
        });

        if (!firstClass) {
            console.log("📚 No classes found. Creating grades and classes...");
            
            // Create a grade
            const [grade] = await db
                .insert(schema.gradesTable)
                .values({
                    schoolId: school.id,
                    name: "1AM",
                    levelOrder: 1,
                    status: schema.StatusEnum.ACTIVE,
                })
                .returning();

            // Create a class
            const [newClass] = await db
                .insert(schema.classesTable)
                .values({
                    schoolId: school.id,
                    gradeId: grade.id,
                    name: "A",
                    status: schema.StatusEnum.ACTIVE,
                })
                .returning();

            firstClass = newClass;
            console.log(`✅ Class created: ${grade.name}-${newClass.name}\n`);
        } else {
            console.log(`✅ Using existing class\n`);
        }

        // =====================================================
        // 1. Create Teacher
        // =====================================================
        console.log("Creating teacher...");
        
        const passwordHash = await passwordHasher.hashPassword("teacher123");
        const [teacherUser] = await db
            .insert(schema.users)
            .values({
                email: `teacher-new-${Date.now()}@school.test`,
                emailVerified: true,
                name: "John Smith",
                gender: schema.UserGenderEnum.MALE,
                role: schema.UserRoleEnum.TEACHER,
                telNumber: faker.phone.number(),
                image: faker.image.avatar(),
            })
            .returning();

        const [teacher] = await db
            .insert(schema.teachersTable)
            .values({
                schoolId: school.id,
                userId: teacherUser.id,
                address: faker.location.streetAddress(),
                dateOfBirth: "1985-03-15",
                about: "Experienced Mathematics teacher",
                joiningDate: new Date().toISOString().split('T')[0],
                status: schema.StatusEnum.ACTIVE,
            })
            .returning();

        console.log(`✅ Teacher created: ${teacherUser.name} (${teacher.id})\n`);

        // =====================================================
        // 2. Create Student
        // =====================================================
        console.log("Creating student...");
        
        const studentPasswordHash = await passwordHasher.hashPassword("student123");
        const [studentUser] = await db
            .insert(schema.users)
            .values({
                email: `student-new-${Date.now()}@school.test`,
                emailVerified: false,
                name: "Alice Johnson",
                gender: schema.UserGenderEnum.FEMALE,
                role: schema.UserRoleEnum.STUDENT,
                telNumber: faker.phone.number(),
                image: faker.image.avatar(),
            })
            .returning();

        const [student] = await db
            .insert(schema.studentsTable)
            .values({
                schoolId: school.id,
                userId: studentUser.id,
                classId: firstClass.id,
                parentPhoneNumber: "+213555123456",
                parentName: "Robert Johnson",
                status: schema.StatusEnum.ACTIVE,
                address: faker.location.streetAddress(),
                dateOfBirth: "2010-07-22",
                enrollmentDate: new Date().toISOString().split('T')[0],
            })
            .returning();

        console.log(`✅ Student created: ${studentUser.name} (${student.id})\n`);

        console.log("✨ Successfully added 1 teacher and 1 student to the database!");
        console.log("\nSummary:");
        console.log(`  Teacher ID: ${teacher.id}`);
        console.log(`  Student ID: ${student.id}`);
        console.log(`  School: ${school.schoolName}`);
        console.log(`\nLogin credentials (for testing):`);
        console.log(`  Teacher - Email: ${teacherUser.email}, Password: teacher123`);
        console.log(`  Student - Email: ${studentUser.email}, Password: student123`);
        
    } catch (error) {
        console.error("❌ Error:", error);
        process.exit(1);
    }
}

main();
