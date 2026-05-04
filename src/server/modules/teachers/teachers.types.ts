import type { StatusEnum, UserGenderEnum, UserRoleEnum } from "#/server/db/schema";
import type { Teacher, User } from "#/server/types";

export type TeacherUser = {
    id: string,
    userId: string,
    teacherId: string,
    email: string;
    emailVerified: boolean;
    image: string | null;
    name: string;
    telNumber: string;
    role: UserRoleEnum;
    createdAt: Date;
    updatedAt: Date;
    schoolId: string;
    gender: UserGenderEnum;
    address: string;
    subjects: { id: string, name: string }[];
    dateOfBirth: string;
    joiningDate: string;
    status: StatusEnum;
    about: string
}

export function TeacherUserDto(
    teacher: Teacher,
    user: User,
    subjects: { id: string, name: string }[]
): TeacherUser {
    return {
        id: teacher.id,
        address: teacher.address,
        createdAt: user.createdAt,
        dateOfBirth: teacher.dateOfBirth,
        email: user.email,
        emailVerified: user.emailVerified,
        gender: user.gender,
        image: user.image,
        name: user.username,
        role: user.role,
        schoolId: teacher.schoolId,
        status: teacher.status,
        updatedAt: user.updatedAt,
        userId: user.id,
        telNumber: user.telNumber,
        joiningDate: teacher.joiningDate,
        teacherId: teacher.id,
        subjects,
        about: teacher.about,
    }
}