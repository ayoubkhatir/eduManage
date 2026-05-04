import type { ID } from "#/schemas/shared.schema";
import type { UserGenderEnum } from "#/server/db/schema";
import type { Student, User } from "#/server/types";

export type StudentUser = {
    id: ID;
    userId: ID;
    schoolId: ID;
    parentPhoneNumber: string;
    parentName: string;
    status: "Active" | "Inactive" | "Pending" | "New";
    gender: UserGenderEnum;
    address: string;
    dateOfBirth: string;
    email: string;
    emailVerified: boolean;
    image: string | null;
    name: string;
    telNumber: string | null;
    role: "Student" | "Teacher" | "Admin";
    createdAt: string;
    updatedAt: string;
    enrollmentDate: string;
    grade: {
        id: ID
        name: string
    },
    class: {
        id: ID,
        name: string
    }
}

export function StudentUserDto(
    student: Student,
    user: User,
    studentClass: { id: string, name: string },
    grade: { id: string, name: string }
): StudentUser {
    return {
        id: student.id,
        address: student.address,
        createdAt: user.createdAt.toISOString(),
        dateOfBirth: student.dateOfBirth,
        email: user.email,
        emailVerified: user.emailVerified,
        gender: user.gender,
        image: user.image,
        name: user.username,
        parentName: student.parentName,
        parentPhoneNumber: student.parentPhoneNumber,
        role: user.role,
        schoolId: student.schoolId,
        status: student.status,
        updatedAt: user.updatedAt.toISOString(),
        userId: user.id,
        telNumber: user.telNumber,
        enrollmentDate: student.enrollmentDate,
        class: studentClass,
        grade
    }
}