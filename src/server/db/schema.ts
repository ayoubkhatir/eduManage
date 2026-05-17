
import {
  text,
  pgTable,
  pgEnum,
  timestamp,
  integer,
  varchar,
  boolean,
  index,
  uniqueIndex,
  date,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import generateId from "../utils/id_generator";

// * enums :

export enum UserRoleEnum {
  STUDENT = "Student",
  ADMIN = "Admin",
  TEACHER = "Teacher"
}
export const userRolesList = Object.values(UserRoleEnum) as [UserRoleEnum, ...UserRoleEnum[]];
export const dbRoleEnum = pgEnum("role", userRolesList);

export enum StatusEnum {
  ACTIVE = "Active",
  NEW = "New",
  INACTIVE = "Inactive",
  PENDING = "Pending"
}
export const statusList = Object.values(StatusEnum) as [StatusEnum, ...StatusEnum[]]
export const dbStatusEnum = pgEnum("status", statusList);

export enum UserGenderEnum {
  MALE = "Male",
  FEMALE = "Female"
}
export const userGendersList = Object.values(UserGenderEnum) as [UserGenderEnum, ...UserGenderEnum[]]
export const dbGenderEnum = pgEnum("gender", userGendersList);

export const users = pgTable("users", {
  id: text("id").primaryKey().$defaultFn(() => generateId()).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  emailVerified: boolean("email_verified").default(false).notNull(),
  image: text("image"),
  gender : dbGenderEnum("gender").notNull(),
  name: varchar("name", { length: 50 }).notNull(),
  telNumber: varchar("tel_number", { length: 20 }),
  role: dbRoleEnum("role").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
});

export const usersRelations = relations(users, ({ one , many}) => ({
  student: one(studentsTable),
  teacher: one(teachersTable),
  admin: one(adminsTable),
  sessions: many(session),
  accounts: many(account),
}));

export const adminsTable = pgTable("admins", {
  id: text("school_id").primaryKey().$defaultFn(() => generateId()).notNull(),
  userId: text("user_id")
    .notNull()
    .unique()
    .references(() => users.id, { onDelete: "cascade" }),
  schoolName: varchar("school_name", { length: 120 }).notNull(),
  numberStudents: integer("number_students").notNull().default(0),
  numberTeachers: integer("number_teachers").notNull().default(0),
});

export const adminsRelations = relations(adminsTable, ({ one, many }) => ({
  user: one(users, {
    fields: [adminsTable.userId],
    references: [users.id],
  }),
  grades: many(gradesTable),
  classes: many(classesTable),
  students: many(studentsTable),
  teachers: many(teachersTable),
  gradeSubjects: many(gradeSubjectsTable),
}));

/**
 * Grades table
 * Example rows:
 * - 1AM
 * - 2AM
 * - 3AM
 */
export const gradesTable = pgTable(
  "grades",
  {
    id: text("id").primaryKey().$defaultFn(() => generateId()).notNull(),
    schoolId: text("school_id")
      .notNull()
      .references(() => adminsTable.id, { onDelete: "cascade" }),

    name: varchar("name", { length: 50 }).notNull(), // e.g. "1AM"
    levelOrder: integer("level_order").notNull(), // e.g. 1, 2, 3...
    status: dbStatusEnum("status").notNull().default(StatusEnum.NEW).$type<StatusEnum>(),

    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => ({
    schoolGradeUnique: uniqueIndex("grades_school_id_name_unique").on(
      table.schoolId,
      table.name
    ),
  })
);

export const gradesRelations = relations(gradesTable, ({ one, many }) => ({
  school: one(adminsTable, {
    fields: [gradesTable.schoolId],
    references: [adminsTable.id],
  }),
  classes: many(classesTable),
  gradeSubjects: many(gradeSubjectsTable),
}))

/**
 * Classes table
 * Example rows:
 * - 1AM-A
 * - 1AM-B
 * - 2AM-A
 */
export const classesTable = pgTable(
  "classes",
  {
    id: text("id").primaryKey().$defaultFn(() => generateId()).notNull(),
    schoolId: text("school_id")
      .notNull()
      .references(() => adminsTable.id, { onDelete: "cascade" }),

    gradeId: text("grade_id")
      .notNull()
      .references(() => gradesTable.id, { onDelete: "cascade" }),

    name: varchar("name", { length: 40 }).notNull(), // e.g. "A", "B", "Science-1"
    status: dbStatusEnum("status").notNull().default(StatusEnum.NEW).$type<StatusEnum>(),

    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => ({
    gradeClassUnique: uniqueIndex("classes_grade_id_name_unique").on(
      table.gradeId,
      table.name
    ),
  })
);

export const classesRelations = relations(classesTable, ({ one, many }) => ({
  school: one(adminsTable, {
    fields: [classesTable.schoolId],
    references: [adminsTable.id],
  }),
  grade: one(gradesTable, {
    fields: [classesTable.gradeId],
    references: [gradesTable.id],
  }),
  students: many(studentsTable),
  assignments: many(teacherAssignmentsTable),
}))

export const studentsTable = pgTable("students", {
  id: text("id").primaryKey().$defaultFn(() => generateId()).notNull(),
  schoolId: text("school_id")
    .notNull()
    .references(() => adminsTable.id, { onDelete: "cascade" }),
  userId: text("user_id")
    .unique()
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),

  classId: text("class_id")
    .notNull()
    .references(() => classesTable.id, { onDelete: "restrict" }),

  parentPhoneNumber: varchar("parent_phone_number", { length: 50 }).notNull(),
  parentName: varchar("parent_name", { length: 120 }).notNull(),
  status: dbStatusEnum("status").notNull().default(StatusEnum.NEW).$type<StatusEnum>(),
  address: text("address").notNull(),
  dateOfBirth: date("date_of_birth").notNull(),
  enrollmentDate: date("enrollement_date").notNull(),
});

export const studentsRelations = relations(studentsTable, ({ one }) => ({
  user: one(users, {
    fields: [studentsTable.userId],
    references: [users.id],
  }),
  school: one(adminsTable, {
    fields: [studentsTable.schoolId],
    references: [adminsTable.id],
  }),
  class: one(classesTable, {
    fields: [studentsTable.classId],
    references: [classesTable.id],
  }),
}));

export const teachersTable = pgTable("teachers", {
  id: text("id").primaryKey().$defaultFn(() => generateId()).notNull(),

  schoolId: text("school_id")
    .notNull()
    .references(() => adminsTable.id, { onDelete: "cascade" }),

  userId: text("user_id")
    .notNull()
    .unique()
    .references(() => users.id, { onDelete: "cascade" }),

  address: text("address").notNull(),
  dateOfBirth: date("date_of_birth").notNull(),
  about: text("about").notNull().default(""),
  joiningDate: date("joining_date").notNull(),
  status: dbStatusEnum("status").notNull().default(StatusEnum.NEW).$type<StatusEnum>(),
})

export const teachersRelations = relations(teachersTable, ({ one, many }) => ({
  user: one(users, {
    fields: [teachersTable.userId],
    references: [users.id],
  }),
  school: one(adminsTable, {
    fields: [teachersTable.schoolId],
    references: [adminsTable.id],
  }),
  assignments: many(teacherAssignmentsTable),
}))

export const subjectsTable = pgTable(
  "subjects",
  {
    id: text("id").primaryKey().$defaultFn(() => generateId()).notNull(),

    schoolId: text("school_id")
      .notNull()
      .references(() => adminsTable.id, { onDelete: "cascade" }),

    name: varchar("name", { length: 80 }).notNull(), // Math, Physics, Arabic
    code: varchar("code", { length: 30 }).notNull(), // MATH, PHY
    status: dbStatusEnum("status").notNull().default(StatusEnum.NEW).$type<StatusEnum>(),

    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => ({
    schoolSubjectUnique: uniqueIndex("subjects_school_id_name_unique").on(
      table.schoolId,
      table.name
    ),
  })
)

export const subjectsRelations = relations(subjectsTable, ({ one, many }) => ({
  school: one(adminsTable, {
    fields: [subjectsTable.schoolId],
    references: [adminsTable.id],
  }),
  assignments: many(teacherAssignmentsTable),
  gradeSubjects: many(gradeSubjectsTable),
}))

export const teacherAssignmentsTable = pgTable(
  "teacher_assignments",
  {
    id: text("id").primaryKey().$defaultFn(() => generateId()).notNull(),

    schoolId: text("school_id")
      .notNull()
      .references(() => adminsTable.id, { onDelete: "cascade" }),

    teacherId: text("teacher_id")
      .notNull()
      .references(() => teachersTable.id, { onDelete: "cascade" }),

    subjectId: text("subject_id")
      .notNull()
      .references(() => subjectsTable.id, { onDelete: "cascade" }),

    classId: text("class_id")
      .notNull()
      .references(() => classesTable.id, { onDelete: "cascade" }),

    // optional but sometimes useful for faster filtering/reporting
    gradeId: text("grade_id").references(() => gradesTable.id, {
      onDelete: "cascade",
    }),

    isPrimaryTeacher: boolean("is_primary_teacher").default(false).notNull(),
    status: dbStatusEnum("status").notNull().default(StatusEnum.NEW).$type<StatusEnum>(),

    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => ({
    uniqueTeacherClassSubject: uniqueIndex(
      "teacher_assignments_teacher_class_subject_unique"
    ).on(table.teacherId, table.classId, table.subjectId),
  })
)


export const teacherAssignmentsRelations = relations(
  teacherAssignmentsTable,
  ({ one }) => ({
    school: one(adminsTable, {
      fields: [teacherAssignmentsTable.schoolId],
      references: [adminsTable.id],
    }),
    teacher: one(teachersTable, {
      fields: [teacherAssignmentsTable.teacherId],
      references: [teachersTable.id],
    }),
    subject: one(subjectsTable, {
      fields: [teacherAssignmentsTable.subjectId],
      references: [subjectsTable.id],
    }),
    class: one(classesTable, {
      fields: [teacherAssignmentsTable.classId],
      references: [classesTable.id],
    }),
  })
)

export const gradeSubjectsTable = pgTable(
  'grade_subjects',
  {
    id: text('id').primaryKey().$defaultFn(() => generateId()).notNull(),

    schoolId: text('school_id')
      .notNull()
      .references(() => adminsTable.id, { onDelete: 'cascade' }),

    gradeId: text('grade_id')
      .notNull()
      .references(() => gradesTable.id, { onDelete: 'cascade' }),

    subjectId: text('subject_id')
      .notNull()
      .references(() => subjectsTable.id, { onDelete: 'cascade' }),

    coefficient: integer('coefficient'),
    weeklyHours: integer('weekly_hours'),

    status: dbStatusEnum('status').notNull().default(StatusEnum.NEW).$type<StatusEnum>(),

    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at')
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => ({
    uniqueGradeSubject: uniqueIndex('grade_subjects_grade_subject_unique').on(
      table.gradeId,
      table.subjectId,
    ),
  }),
)

export const gradeSubjectsRelations = relations(
  gradeSubjectsTable,
  ({ one }) => ({
    school: one(adminsTable, {
      fields: [gradeSubjectsTable.schoolId],
      references: [adminsTable.id],
    }),
    grade: one(gradesTable, {
      fields: [gradeSubjectsTable.gradeId],
      references: [gradesTable.id],
    }),
    subject: one(subjectsTable, {
      fields: [gradeSubjectsTable.subjectId],
      references: [subjectsTable.id],
    }),
  }),
)

export const assessmentPeriodsTable = pgTable(
  "assessment_periods",
  {
    id: text("id").primaryKey().$defaultFn(() => generateId()).notNull(),

    schoolId: text("school_id")
      .notNull()
      .references(() => adminsTable.id, { onDelete: "cascade" }),

    name: varchar("name", { length: 80 }).notNull(), // "Trimester 1", "Semester 2"
    code: varchar("code", { length: 30 }), // T1, S2
    startDate: timestamp("start_date").notNull(),
    endDate: timestamp("end_date").notNull(),
    status: dbStatusEnum("status").notNull().default(StatusEnum.NEW).$type<StatusEnum>(),

    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => ({
    uniquePeriodPerSchool: uniqueIndex("assessment_periods_school_name_unique").on(
      table.schoolId,
      table.name
    ),
  })
)

export const assessmentTypeEnum = pgEnum("assessment_type", [
  "Homework",
  "Quiz",
  "Test",
  "Exam",
  "Project",
  "Participation",
])

export const assessmentsTable = pgTable(
  "assessments",
  {
    id: text("id").primaryKey().$defaultFn(() => generateId()).notNull(),

    schoolId: text("school_id")
      .notNull()
      .references(() => adminsTable.id, { onDelete: "cascade" }),

    classId: text("class_id")
      .notNull()
      .references(() => classesTable.id, { onDelete: "cascade" }),

    subjectId: text("subject_id")
      .notNull()
      .references(() => subjectsTable.id, { onDelete: "cascade" }),

    teacherAssignmentId: text("teacher_assignment_id")
      .references(() => teacherAssignmentsTable.id, { onDelete: "set null" }),

    periodId: text("period_id")
      .references(() => assessmentPeriodsTable.id, { onDelete: "set null" }),

    title: varchar("title", { length: 120 }).notNull(), // "Math Test 1"
    type: assessmentTypeEnum("type").notNull().default("Test"),

    maxScore: integer("max_score").notNull().default(20),
    weight: integer("weight").notNull().default(1), // coefficient inside subject period
    assessmentDate: timestamp("assessment_date"),
    notes: text("notes"),

    status: dbStatusEnum("status").notNull().default(StatusEnum.NEW).$type<StatusEnum>(),

    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  }
)

export const studentMarksTable = pgTable(
  "student_marks",
  {
    id: text("id").primaryKey().$defaultFn(() => generateId()).notNull(),

    schoolId: text("school_id")
      .notNull()
      .references(() => adminsTable.id, { onDelete: "cascade" }),

    assessmentId: text("assessment_id")
      .notNull()
      .references(() => assessmentsTable.id, { onDelete: "cascade" }),

    studentId: text("student_id")
      .notNull()
      .references(() => studentsTable.id, { onDelete: "cascade" }),

    score: integer("score"), // nullable until entered
    absent: boolean("absent").notNull().default(false),
    excused: boolean("excused").notNull().default(false),
    comment: text("comment"),

    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => ({
    uniqueAssessmentStudent: uniqueIndex("student_marks_assessment_student_unique").on(
      table.assessmentId,
      table.studentId
    ),
  })
)

export const assessmentPeriodsRelations = relations(assessmentPeriodsTable, ({ one, many }) => ({
  school: one(adminsTable, {
    fields: [assessmentPeriodsTable.schoolId],
    references: [adminsTable.id],
  }),
  assessments: many(assessmentsTable),
}))

export const assessmentsRelations = relations(assessmentsTable, ({ one, many }) => ({
  school: one(adminsTable, {
    fields: [assessmentsTable.schoolId],
    references: [adminsTable.id],
  }),
  class: one(classesTable, {
    fields: [assessmentsTable.classId],
    references: [classesTable.id],
  }),
  subject: one(subjectsTable, {
    fields: [assessmentsTable.subjectId],
    references: [subjectsTable.id],
  }),
  teacherAssignment: one(teacherAssignmentsTable, {
    fields: [assessmentsTable.teacherAssignmentId],
    references: [teacherAssignmentsTable.id],
  }),
  period: one(assessmentPeriodsTable, {
    fields: [assessmentsTable.periodId],
    references: [assessmentPeriodsTable.id],
  }),
  marks: many(studentMarksTable),
}))

export const studentMarksRelations = relations(studentMarksTable, ({ one }) => ({
  school: one(adminsTable, {
    fields: [studentMarksTable.schoolId],
    references: [adminsTable.id],
  }),
  assessment: one(assessmentsTable, {
    fields: [studentMarksTable.assessmentId],
    references: [assessmentsTable.id],
  }),
  student: one(studentsTable, {
    fields: [studentMarksTable.studentId],
    references: [studentsTable.id],
  }),
}))

export const eventsTable = pgTable('events', {
  id: text('id').primaryKey().$defaultFn(() => generateId()).notNull(),

  schoolId: text('school_id')
    .notNull()
    .references(() => adminsTable.id, { onDelete: 'cascade' }),

  classId: text('class_id').references(() => classesTable.id, {
    onDelete: 'set null',
  }),

  teacherId: text('teacher_id').references(() => teachersTable.id, {
    onDelete: 'set null',
  }),

  subjectId: text('subject_id').references(() => subjectsTable.id, {
    onDelete: 'set null',
  }),

  title: varchar('title', { length: 150 }).notNull(),
  description: text('description'),
  color: varchar('color', { length: 50 }).notNull().default('#2563eb'),

  start: timestamp('start').notNull(),
  end: timestamp('end').notNull(),

  allDay: boolean('all_day').notNull().default(false),
  repeatWeekly: boolean('repeat_weekly').notNull().default(false),
  isClass: boolean('is_class').notNull().default(false),

  status: dbStatusEnum('status').notNull().default(StatusEnum.NEW).$type<StatusEnum>(),

  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at')
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
})

export const eventsRelations = relations(eventsTable, ({ one }) => ({
  school: one(adminsTable, {
    fields: [eventsTable.schoolId],
    references: [adminsTable.id],
  }),
  class: one(classesTable, {
    fields: [eventsTable.classId],
    references: [classesTable.id],
  }),
  teacher: one(teachersTable, {
    fields: [eventsTable.teacherId],
    references: [teachersTable.id],
  }),
  subject: one(subjectsTable, {
    fields: [eventsTable.subjectId],
    references: [subjectsTable.id],
  }),
}))


export enum ResourceTypeEnum {
  PDF = "pdf",
  DOCX = "docx",
  XLSX = "xlsx",
  PNG = "png",
  ZIP = "zip",
  MP4 = "mp4",
  PPTX = "pptx",
  TXT = "txt"
}
export const resourceTypesList = Object.values(ResourceTypeEnum) as [ResourceTypeEnum, ...ResourceTypeEnum[]];
export const resourceTypeEnum = pgEnum('resource_type', resourceTypesList)

export const resourcesTable = pgTable(
  'resources',
  {
    id: text('id').primaryKey().$defaultFn(() => generateId()).notNull(),

    schoolId: text('school_id')
      .notNull()
      .references(() => adminsTable.id, { onDelete: 'cascade' }),

    subjectId: text('subject_id')
      .notNull()
      .references(() => subjectsTable.id, { onDelete: 'cascade' }),

    classId: text('class_id').references(() => classesTable.id, {
      onDelete: 'set null',
    }),

    teacherId: text('teacher_id').references(() => teachersTable.id, {
      onDelete: 'set null',
    }),

    fileName: varchar('file_name', { length: 255 }).notNull(),
    type: resourceTypeEnum('type').notNull(),
    size: varchar('size', { length: 50 }).notNull(),

    fileUrl: text('file_url'),
    description: text('description'),

    visibility: varchar('visibility', { length: 50 })
      .notNull()
      .default('class'), // 'class' | 'subject' | 'school'

    status: dbStatusEnum('status')
      .notNull()
      .default(StatusEnum.NEW)
      .$type<StatusEnum>(),

    dateAdded: timestamp('date_added').defaultNow().notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at')
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => ({
    resourceScopedUnique: uniqueIndex('resources_school_subject_class_file_unique').on(
      table.schoolId,
      table.subjectId,
      table.classId,
      table.fileName,
    ),
  }),
)

export const resourcesRelations = relations(resourcesTable, ({ one }) => ({
  school: one(adminsTable, {
    fields: [resourcesTable.schoolId],
    references: [adminsTable.id],
  }),
  subject: one(subjectsTable, {
    fields: [resourcesTable.subjectId],
    references: [subjectsTable.id],
  }),
  class: one(classesTable, {
    fields: [resourcesTable.classId],
    references: [classesTable.id],
  }),
  teacher: one(teachersTable, {
    fields: [resourcesTable.teacherId],
    references: [teachersTable.id],
  }),
}))


// Better Auth tables
export const session = pgTable(
  "session",
  {
    id: text("id").primaryKey(),
    expiresAt: timestamp("expires_at").notNull(),
    token: text("token").notNull().unique(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
    ipAddress: text("ip_address"),
    userAgent: text("user_agent"),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
  },
  (table) => [index("session_userId_idx").on(table.userId)],
);

export const account = pgTable(
  "account",
  {
    id: text("id").primaryKey(),
    accountId: text("account_id").notNull(),
    providerId: text("provider_id").notNull(),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    accessToken: text("access_token"),
    refreshToken: text("refresh_token"),
    idToken: text("id_token"),
    accessTokenExpiresAt: timestamp("access_token_expires_at"),
    refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
    scope: text("scope"),
    password: text("password"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [index("account_userId_idx").on(table.userId)],
);

export const verification = pgTable(
  "verification",
  {
    id: text("id").primaryKey(),
    identifier: text("identifier").notNull(),
    value: text("value").notNull(),
    expiresAt: timestamp("expires_at").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [index("verification_identifier_idx").on(table.identifier)],
);



export const sessionRelations = relations(session, ({ one }) => ({
  users: one(users, {
    fields: [session.userId],
    references: [users.id],
  }),
}));

export const accountRelations = relations(account, ({ one }) => ({
  users: one(users, {
    fields: [account.userId],
    references: [users.id],
  }),
}));