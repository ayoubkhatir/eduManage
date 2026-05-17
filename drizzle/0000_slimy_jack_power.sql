CREATE TYPE "public"."assessment_type" AS ENUM('Homework', 'Quiz', 'Test', 'Exam', 'Project', 'Participation');--> statement-breakpoint
CREATE TYPE "public"."gender" AS ENUM('Male', 'Female');--> statement-breakpoint
CREATE TYPE "public"."role" AS ENUM('Student', 'Admin', 'Teacher');--> statement-breakpoint
CREATE TYPE "public"."status" AS ENUM('Active', 'New', 'Inactive', 'Pending');--> statement-breakpoint
CREATE TYPE "public"."resource_type" AS ENUM('pdf', 'docx', 'xlsx', 'png', 'zip', 'mp4', 'pptx', 'txt');--> statement-breakpoint
CREATE TABLE "admins" (
	"school_id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"school_name" varchar(120) NOT NULL,
	"number_students" integer DEFAULT 0 NOT NULL,
	"number_teachers" integer DEFAULT 0 NOT NULL,
	CONSTRAINT "admins_user_id_unique" UNIQUE("user_id")
);
--> statement-breakpoint
CREATE TABLE "assessment_periods" (
	"id" text PRIMARY KEY NOT NULL,
	"school_id" text NOT NULL,
	"name" varchar(80) NOT NULL,
	"code" varchar(30),
	"start_date" timestamp NOT NULL,
	"end_date" timestamp NOT NULL,
	"status" "status" DEFAULT 'New' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "assessments" (
	"id" text PRIMARY KEY NOT NULL,
	"school_id" text NOT NULL,
	"class_id" text NOT NULL,
	"subject_id" text NOT NULL,
	"teacher_assignment_id" text,
	"period_id" text,
	"title" varchar(120) NOT NULL,
	"type" "assessment_type" DEFAULT 'Test' NOT NULL,
	"max_score" integer DEFAULT 20 NOT NULL,
	"weight" integer DEFAULT 1 NOT NULL,
	"assessment_date" timestamp,
	"notes" text,
	"status" "status" DEFAULT 'New' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "classes" (
	"id" text PRIMARY KEY NOT NULL,
	"school_id" text NOT NULL,
	"grade_id" text NOT NULL,
	"name" varchar(40) NOT NULL,
	"status" "status" DEFAULT 'New' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "events" (
	"id" text PRIMARY KEY NOT NULL,
	"school_id" text NOT NULL,
	"class_id" text,
	"teacher_id" text,
	"subject_id" text,
	"title" varchar(150) NOT NULL,
	"description" text,
	"color" varchar(50) DEFAULT '#2563eb' NOT NULL,
	"start" timestamp NOT NULL,
	"end" timestamp NOT NULL,
	"all_day" boolean DEFAULT false NOT NULL,
	"repeat_weekly" boolean DEFAULT false NOT NULL,
	"is_class" boolean DEFAULT false NOT NULL,
	"status" "status" DEFAULT 'New' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "grade_subjects" (
	"id" text PRIMARY KEY NOT NULL,
	"school_id" text NOT NULL,
	"grade_id" text NOT NULL,
	"subject_id" text NOT NULL,
	"coefficient" integer,
	"weekly_hours" integer,
	"status" "status" DEFAULT 'New' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "grades" (
	"id" text PRIMARY KEY NOT NULL,
	"school_id" text NOT NULL,
	"name" varchar(50) NOT NULL,
	"level_order" integer NOT NULL,
	"status" "status" DEFAULT 'New' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "resources" (
	"id" text PRIMARY KEY NOT NULL,
	"school_id" text NOT NULL,
	"subject_id" text NOT NULL,
	"class_id" text,
	"teacher_id" text,
	"file_name" varchar(255) NOT NULL,
	"type" "resource_type" NOT NULL,
	"size" varchar(50) NOT NULL,
	"file_url" text,
	"description" text,
	"visibility" varchar(50) DEFAULT 'class' NOT NULL,
	"status" "status" DEFAULT 'New' NOT NULL,
	"date_added" timestamp DEFAULT now() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "sessions" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "student_marks" (
	"id" text PRIMARY KEY NOT NULL,
	"school_id" text NOT NULL,
	"assessment_id" text NOT NULL,
	"student_id" text NOT NULL,
	"score" integer,
	"absent" boolean DEFAULT false NOT NULL,
	"excused" boolean DEFAULT false NOT NULL,
	"comment" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "students" (
	"id" text PRIMARY KEY NOT NULL,
	"school_id" text NOT NULL,
	"user_id" text NOT NULL,
	"class_id" text NOT NULL,
	"parent_phone_number" varchar(50) NOT NULL,
	"parent_name" varchar(120) NOT NULL,
	"status" "status" DEFAULT 'New' NOT NULL,
	"address" text NOT NULL,
	"date_of_birth" date NOT NULL,
	"enrollement_date" date NOT NULL,
	CONSTRAINT "students_user_id_unique" UNIQUE("user_id")
);
--> statement-breakpoint
CREATE TABLE "subjects" (
	"id" text PRIMARY KEY NOT NULL,
	"school_id" text NOT NULL,
	"name" varchar(80) NOT NULL,
	"code" varchar(30) NOT NULL,
	"status" "status" DEFAULT 'New' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "teacher_assignments" (
	"id" text PRIMARY KEY NOT NULL,
	"school_id" text NOT NULL,
	"teacher_id" text NOT NULL,
	"subject_id" text NOT NULL,
	"class_id" text NOT NULL,
	"grade_id" text,
	"is_primary_teacher" boolean DEFAULT false NOT NULL,
	"status" "status" DEFAULT 'New' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "teachers" (
	"id" text PRIMARY KEY NOT NULL,
	"school_id" text NOT NULL,
	"user_id" text NOT NULL,
	"address" text NOT NULL,
	"date_of_birth" date NOT NULL,
	"about" text DEFAULT '' NOT NULL,
	"joining_date" date NOT NULL,
	"status" "status" DEFAULT 'New' NOT NULL,
	CONSTRAINT "teachers_user_id_unique" UNIQUE("user_id")
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" text PRIMARY KEY NOT NULL,
	"username" varchar(50) NOT NULL,
	"email" varchar(255) NOT NULL,
	"email_verified" boolean DEFAULT false NOT NULL,
	"image" text,
	"password_hash" varchar(255) NOT NULL,
	"tel_number" varchar(50) NOT NULL,
	"role" "role" NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"gender" "gender" NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "admins" ADD CONSTRAINT "admins_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "assessment_periods" ADD CONSTRAINT "assessment_periods_school_id_admins_school_id_fk" FOREIGN KEY ("school_id") REFERENCES "public"."admins"("school_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "assessments" ADD CONSTRAINT "assessments_school_id_admins_school_id_fk" FOREIGN KEY ("school_id") REFERENCES "public"."admins"("school_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "assessments" ADD CONSTRAINT "assessments_class_id_classes_id_fk" FOREIGN KEY ("class_id") REFERENCES "public"."classes"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "assessments" ADD CONSTRAINT "assessments_subject_id_subjects_id_fk" FOREIGN KEY ("subject_id") REFERENCES "public"."subjects"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "assessments" ADD CONSTRAINT "assessments_teacher_assignment_id_teacher_assignments_id_fk" FOREIGN KEY ("teacher_assignment_id") REFERENCES "public"."teacher_assignments"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "assessments" ADD CONSTRAINT "assessments_period_id_assessment_periods_id_fk" FOREIGN KEY ("period_id") REFERENCES "public"."assessment_periods"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "classes" ADD CONSTRAINT "classes_school_id_admins_school_id_fk" FOREIGN KEY ("school_id") REFERENCES "public"."admins"("school_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "classes" ADD CONSTRAINT "classes_grade_id_grades_id_fk" FOREIGN KEY ("grade_id") REFERENCES "public"."grades"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "events" ADD CONSTRAINT "events_school_id_admins_school_id_fk" FOREIGN KEY ("school_id") REFERENCES "public"."admins"("school_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "events" ADD CONSTRAINT "events_class_id_classes_id_fk" FOREIGN KEY ("class_id") REFERENCES "public"."classes"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "events" ADD CONSTRAINT "events_teacher_id_teachers_id_fk" FOREIGN KEY ("teacher_id") REFERENCES "public"."teachers"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "events" ADD CONSTRAINT "events_subject_id_subjects_id_fk" FOREIGN KEY ("subject_id") REFERENCES "public"."subjects"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "grade_subjects" ADD CONSTRAINT "grade_subjects_school_id_admins_school_id_fk" FOREIGN KEY ("school_id") REFERENCES "public"."admins"("school_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "grade_subjects" ADD CONSTRAINT "grade_subjects_grade_id_grades_id_fk" FOREIGN KEY ("grade_id") REFERENCES "public"."grades"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "grade_subjects" ADD CONSTRAINT "grade_subjects_subject_id_subjects_id_fk" FOREIGN KEY ("subject_id") REFERENCES "public"."subjects"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "grades" ADD CONSTRAINT "grades_school_id_admins_school_id_fk" FOREIGN KEY ("school_id") REFERENCES "public"."admins"("school_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "resources" ADD CONSTRAINT "resources_school_id_admins_school_id_fk" FOREIGN KEY ("school_id") REFERENCES "public"."admins"("school_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "resources" ADD CONSTRAINT "resources_subject_id_subjects_id_fk" FOREIGN KEY ("subject_id") REFERENCES "public"."subjects"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "resources" ADD CONSTRAINT "resources_class_id_classes_id_fk" FOREIGN KEY ("class_id") REFERENCES "public"."classes"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "resources" ADD CONSTRAINT "resources_teacher_id_teachers_id_fk" FOREIGN KEY ("teacher_id") REFERENCES "public"."teachers"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "student_marks" ADD CONSTRAINT "student_marks_school_id_admins_school_id_fk" FOREIGN KEY ("school_id") REFERENCES "public"."admins"("school_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "student_marks" ADD CONSTRAINT "student_marks_assessment_id_assessments_id_fk" FOREIGN KEY ("assessment_id") REFERENCES "public"."assessments"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "student_marks" ADD CONSTRAINT "student_marks_student_id_students_id_fk" FOREIGN KEY ("student_id") REFERENCES "public"."students"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "students" ADD CONSTRAINT "students_school_id_admins_school_id_fk" FOREIGN KEY ("school_id") REFERENCES "public"."admins"("school_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "students" ADD CONSTRAINT "students_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "students" ADD CONSTRAINT "students_class_id_classes_id_fk" FOREIGN KEY ("class_id") REFERENCES "public"."classes"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "subjects" ADD CONSTRAINT "subjects_school_id_admins_school_id_fk" FOREIGN KEY ("school_id") REFERENCES "public"."admins"("school_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "teacher_assignments" ADD CONSTRAINT "teacher_assignments_school_id_admins_school_id_fk" FOREIGN KEY ("school_id") REFERENCES "public"."admins"("school_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "teacher_assignments" ADD CONSTRAINT "teacher_assignments_teacher_id_teachers_id_fk" FOREIGN KEY ("teacher_id") REFERENCES "public"."teachers"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "teacher_assignments" ADD CONSTRAINT "teacher_assignments_subject_id_subjects_id_fk" FOREIGN KEY ("subject_id") REFERENCES "public"."subjects"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "teacher_assignments" ADD CONSTRAINT "teacher_assignments_class_id_classes_id_fk" FOREIGN KEY ("class_id") REFERENCES "public"."classes"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "teacher_assignments" ADD CONSTRAINT "teacher_assignments_grade_id_grades_id_fk" FOREIGN KEY ("grade_id") REFERENCES "public"."grades"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "teachers" ADD CONSTRAINT "teachers_school_id_admins_school_id_fk" FOREIGN KEY ("school_id") REFERENCES "public"."admins"("school_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "teachers" ADD CONSTRAINT "teachers_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "assessment_periods_school_name_unique" ON "assessment_periods" USING btree ("school_id","name");--> statement-breakpoint
CREATE UNIQUE INDEX "classes_grade_id_name_unique" ON "classes" USING btree ("grade_id","name");--> statement-breakpoint
CREATE UNIQUE INDEX "grade_subjects_grade_subject_unique" ON "grade_subjects" USING btree ("grade_id","subject_id");--> statement-breakpoint
CREATE UNIQUE INDEX "grades_school_id_name_unique" ON "grades" USING btree ("school_id","name");--> statement-breakpoint
CREATE UNIQUE INDEX "resources_school_subject_class_file_unique" ON "resources" USING btree ("school_id","subject_id","class_id","file_name");--> statement-breakpoint
CREATE UNIQUE INDEX "student_marks_assessment_student_unique" ON "student_marks" USING btree ("assessment_id","student_id");--> statement-breakpoint
CREATE UNIQUE INDEX "subjects_school_id_name_unique" ON "subjects" USING btree ("school_id","name");--> statement-breakpoint
CREATE UNIQUE INDEX "teacher_assignments_teacher_class_subject_unique" ON "teacher_assignments" USING btree ("teacher_id","class_id","subject_id");