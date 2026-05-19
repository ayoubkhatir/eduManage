import "dotenv/config";
import { faker } from "@faker-js/faker";
import { eq, inArray } from "drizzle-orm";
import { db } from "#/server/db/db";
import * as schema from "#/server/db/schema";
import generateId from "#/server/utils/id_generator";
import { handlePassword } from "#/server/utils/handle-password";

faker.seed(42);

const SCHOOLS = [
	{
		schoolName: "El Maarifa School",
		adminEmail: "admin@maarifa.edu",
		adminName: "Main Admin",
	},
	{
		schoolName: "Al Noor School",
		adminEmail: "admin@alnoor.edu",
		adminName: "Main Admin 2",
	},
] as const;

const ADMIN_PASSWORD = "admin123";
const TEACHER_PASSWORD = "teacher123";
const STUDENT_PASSWORD = "student123";

function toDateOnly(value: Date): string {
	return value.toISOString().slice(0, 10);
}

function hoursFromNow(hours: number): Date {
	return new Date(Date.now() + hours * 60 * 60 * 1000);
}

async function ensureCredentialsAccount(userId: string, password: string) {
	const existingCredentialAccount = await db.query.account.findFirst({
		where: (account, { and, eq }) =>
			and(eq(account.userId, userId), eq(account.providerId, "credential")),
	});

	const passwordHash = await handlePassword.hash(password);

	if (existingCredentialAccount) {
		await db
			.update(schema.account)
			.set({
				password: passwordHash,
				updatedAt: new Date(),
			})
			.where(eq(schema.account.id, existingCredentialAccount.id));
		return;
	}

	await db.insert(schema.account).values({
		id: generateId(),
		userId,
		accountId: userId,
		providerId: "credential",
		password: passwordHash,
		createdAt: new Date(),
	});
}

async function backfillSchoolAccounts(schoolId: string, schoolName: string) {
	const admin = await db.query.adminsTable.findFirst({
		where: eq(schema.adminsTable.id, schoolId),
	});

	if (!admin) {
		return;
	}

	const teacherRows = await db.query.teachersTable.findMany({
		where: eq(schema.teachersTable.schoolId, schoolId),
		columns: { userId: true },
	});

	const studentRows = await db.query.studentsTable.findMany({
		where: eq(schema.studentsTable.schoolId, schoolId),
		columns: { userId: true },
	});

	const userIds = [
		admin.userId,
		...teacherRows.map((row) => row.userId),
		...studentRows.map((row) => row.userId),
	];

	const usersToBackfill = await db
			.select({ id: schema.users.id, name: schema.users.name, role: schema.users.role })
		.from(schema.users)
		.where(inArray(schema.users.id, userIds));

	for (const user of usersToBackfill) {
		const password =
			user.role === schema.UserRoleEnum.ADMIN
				? ADMIN_PASSWORD
				: user.role === schema.UserRoleEnum.TEACHER
					? TEACHER_PASSWORD
					: STUDENT_PASSWORD;
		await ensureCredentialsAccount(user.id, password);
	}

	console.log(`✅ Backfilled Better Auth accounts for ${schoolName}`);
}

async function main() {
	console.log("🌱 Seeding database...");

	// Better Auth signInEmail expects providerId = "credential"
	await db
		.update(schema.account)
		.set({ providerId: "credential", updatedAt: new Date() })
		.where(eq(schema.account.providerId, "credentials"));

	async function seedSchool(school: (typeof SCHOOLS)[number]) {
		const existingUser = await db.query.users.findFirst({
			where: eq(schema.users.email, school.adminEmail),
		});

		if (existingUser) {
			const existingAdmin = await db.query.adminsTable.findFirst({
				where: eq(schema.adminsTable.userId, existingUser.id),
			});
			if (existingAdmin) {
				await backfillSchoolAccounts(existingAdmin.id, school.schoolName);
				console.log(`✅ ${school.schoolName} already exists, skipping data creation.`);
				return null;
			}
		}

		let adminUser = existingUser;
		if (!adminUser) {
			const [createdAdminUser] = await db
				.insert(schema.users)
				.values({
					email: school.adminEmail,
					emailVerified: true,
					name: school.adminName,
					gender: schema.UserGenderEnum.MALE,
					role: schema.UserRoleEnum.ADMIN,
				})
				.returning();

			adminUser = createdAdminUser;
		}

		await ensureCredentialsAccount(adminUser.id, ADMIN_PASSWORD);

		const schoolId = faker.string.alphanumeric(12).toLowerCase();
		await db.insert(schema.adminsTable).values({
			id: schoolId,
			userId: adminUser.id,
			schoolName: school.schoolName,
			numberStudents: 0,
			numberTeachers: 0,
		});

		const grades = await db
			.insert(schema.gradesTable)
			.values(
				[
					{ name: "1AM", levelOrder: 1 },
					{ name: "1BM", levelOrder: 1 },
					{ name: "2AM", levelOrder: 2 },
					{ name: "2BM", levelOrder: 2 },
					{ name: "3AM", levelOrder: 3 },
					{ name: "3BM", levelOrder: 3 },
					{ name: "4AM", levelOrder: 4 },
					{ name: "4BM", levelOrder: 4 },
				].map((grade) => ({
					schoolId,
					name: grade.name,
					levelOrder: grade.levelOrder,
					status: schema.StatusEnum.ACTIVE,
				}))
			)
			.returning();

		const subjects = await db
			.insert(schema.subjectsTable)
			.values(
				[
					{ name: "Mathematics", code: "MATH" },
					{ name: "Arabic", code: "ARAB" },
					{ name: "English", code: "ENG" },
					{ name: "Science", code: "SCI" },
					{ name: "Social Studies", code: "HIST" },
					{ name: "Physical Education", code: "PE" },
				].map((subject) => ({
					schoolId,
					name: subject.name,
					code: subject.code,
					status: schema.StatusEnum.ACTIVE,
				}))
			)
			.returning();

		await db.insert(schema.gradeSubjectsTable).values(
			grades.flatMap((grade) =>
				subjects.map((subject, index) => ({
					schoolId,
					gradeId: grade.id,
					subjectId: subject.id,
					coefficient: index < 3 ? 4 : 2,
					weeklyHours: index < 3 ? 4 : 2,
					status: schema.StatusEnum.ACTIVE,
				}))
			)
		);

		const classes = await db
			.insert(schema.classesTable)
			.values(
				grades.flatMap((grade) =>
					["A", "B"].map((section) => ({
						schoolId,
						gradeId: grade.id,
						name: `${grade.name}-${section}`,
						status: schema.StatusEnum.ACTIVE,
					}))
				)
			)
			.returning();

		const teacherUsers = await db
			.insert(schema.users)
			.values(
				Array.from({ length: 8 }, (_, index) => ({
					email: `${school.adminEmail.replace("admin", `teacher${index + 1}`)}`,
					emailVerified: true,
					name: faker.person.fullName(),
					gender: index % 2 === 0 ? schema.UserGenderEnum.MALE : schema.UserGenderEnum.FEMALE,
					role: schema.UserRoleEnum.TEACHER,
				}))
			)
			.returning();

		const teachers = await db
			.insert(schema.teachersTable)
			.values(
				teacherUsers.map((user, index) => ({
					schoolId,
					userId: user.id,
					address: faker.location.streetAddress(),
					dateOfBirth: toDateOnly(faker.date.birthdate({ min: 28, max: 55, mode: "age" })),
					about: `Teacher profile ${index + 1}`,
					joiningDate: toDateOnly(faker.date.past({ years: 6 })),
					status: schema.StatusEnum.ACTIVE,
				}))
			)
			.returning();

		for (const teacherUser of teacherUsers) {
			await ensureCredentialsAccount(teacherUser.id, TEACHER_PASSWORD);
		}

		const studentUsers = await db
			.insert(schema.users)
			.values(
				Array.from({ length: classes.length * 5 }, (_, index) => ({
					email: `student${school.schoolName.replace(/\s+/g, "").toLowerCase()}${index + 1}@maarifa.edu`,
					emailVerified: true,
					name: faker.person.fullName(),
					gender: index % 2 === 0 ? schema.UserGenderEnum.MALE : schema.UserGenderEnum.FEMALE,
					role: schema.UserRoleEnum.STUDENT,
				}))
			)
			.returning();

		const students = await db
			.insert(schema.studentsTable)
			.values(
				studentUsers.map((user, index) => {
					const classIndex = Math.floor(index / 5);
					return {
						schoolId,
						userId: user.id,
						classId: classes[classIndex].id,
						parentPhoneNumber: faker.phone.number(),
						parentName: faker.person.fullName(),
						address: faker.location.streetAddress(),
						dateOfBirth: toDateOnly(faker.date.birthdate({ min: 6, max: 18, mode: "age" })),
						enrollmentDate: toDateOnly(faker.date.past({ years: 2 })),
						status: schema.StatusEnum.ACTIVE,
					};
				})
			)
			.returning();

		for (const studentUser of studentUsers) {
			await ensureCredentialsAccount(studentUser.id, STUDENT_PASSWORD);
		}

		const assignments = await db
			.insert(schema.teacherAssignmentsTable)
			.values(
				classes.flatMap((classItem, classIndex) =>
					subjects.slice(0, 3).map((subject, subjectIndex) => ({
						schoolId,
						teacherId: teachers[(classIndex + subjectIndex) % teachers.length].id,
						subjectId: subject.id,
						classId: classItem.id,
						gradeId: classItem.gradeId,
						isPrimaryTeacher: subjectIndex === 0,
						status: schema.StatusEnum.ACTIVE,
					}))
				)
			)
			.returning();

		const periods = await db
			.insert(schema.assessmentPeriodsTable)
			.values(
				[
					{ name: "Period 1", startDate: new Date("2024-09-01T00:00:00Z"), endDate: new Date("2024-11-30T23:59:59Z") },
					{ name: "Period 2", startDate: new Date("2024-12-01T00:00:00Z"), endDate: new Date("2025-02-28T23:59:59Z") },
					{ name: "Period 3", startDate: new Date("2025-03-01T00:00:00Z"), endDate: new Date("2025-05-31T23:59:59Z") },
				].map((period) => ({
					schoolId,
					name: period.name,
					code: period.name.replace(/\s+/g, "").toUpperCase(),
					startDate: period.startDate,
					endDate: period.endDate,
					status: schema.StatusEnum.ACTIVE,
				}))
			)
			.returning();

		const assessments = await db
			.insert(schema.assessmentsTable)
			.values(
				assignments.flatMap((assignment, index) => {
					const subject = subjects.find((item) => item.id === assignment.subjectId)!;
					return periods.map((period, periodIndex) => ({
						schoolId,
						classId: assignment.classId,
						subjectId: assignment.subjectId,
						teacherAssignmentId: assignment.id,
						periodId: period.id,
						title: `${period.name} ${subject.name} - ${assignment.classId.slice(-4)}`,
						type: periodIndex === 2 ? schema.AssessmentTypeEnum.Exam : schema.AssessmentTypeEnum.Test,
						maxScore: 20,
						weight: periodIndex === 2 ? 2 : 1,
						assessmentDate: hoursFromNow(24 + index),
						notes: `Seeded assessment for ${subject.name}`,
						status: schema.StatusEnum.ACTIVE,
					}));
				})
			)
			.returning();

		const marksToInsert = assessments.flatMap((assessment) => {
			const classStudents = students.filter((student) => student.classId === assessment.classId);
			return classStudents.map((student) => ({
				schoolId,
				assessmentId: assessment.id,
				studentId: student.id,
				score: faker.number.int({ min: 10, max: 20 }),
				absent: false,
				excused: false,
				comment: faker.lorem.sentence(),
			}));
		});

		const marks = await db.insert(schema.studentMarksTable).values(marksToInsert).returning();

		const events = await db
			.insert(schema.eventsTable)
			.values(
				Array.from({ length: 20 }, (_, index) => {
					const classItem = classes[index % classes.length];
					const teacher = teachers[index % teachers.length];
					const subject = subjects[index % subjects.length];
					const start = hoursFromNow(index * 12);
					return {
						schoolId,
						classId: classItem.id,
						teacherId: teacher.id,
						subjectId: subject.id,
						title: `${school.schoolName} event ${index + 1}`,
						description: faker.lorem.paragraph(),
						color: ["#2563eb", "#16a34a", "#f59e0b", "#dc2626"][index % 4],
						start,
						end: new Date(start.getTime() + 2 * 60 * 60 * 1000),
						allDay: index % 5 === 0,
						repeatWeekly: index % 7 === 0,
						isClass: index % 2 === 0,
						status: schema.StatusEnum.ACTIVE,
					};
				})
			)
			.returning();

		console.log(`✅ Seeded ${school.schoolName}`);
		console.log(`  School ID: ${schoolId}`);
		console.log(`  Grades: ${grades.length}`);
		console.log(`  Subjects: ${subjects.length}`);
		console.log(`  Classes: ${classes.length}`);
		console.log(`  Teachers: ${teacherUsers.length}`);
		console.log(`  Students: ${studentUsers.length}`);
		console.log(`  Assignments: ${assignments.length}`);
		console.log(`  Periods: ${periods.length}`);
		console.log(`  Assessments: ${assessments.length}`);
		console.log(`  Marks: ${marks.length}`);
		console.log(`  Events: ${events.length}`);

		return schoolId;
	}

	const seededSchoolIds: string[] = [];

	for (const school of SCHOOLS) {
		const schoolId = await seedSchool(school);
		if (schoolId) {
			seededSchoolIds.push(schoolId);
		}
	}

	console.log("\n✨ Database seeding complete");
	console.log(`Schools seeded this run: ${seededSchoolIds.length}`);
}

main().catch((error) => {
	console.error("❌ Seed failed");
	console.error(error);
	process.exit(1);
});
