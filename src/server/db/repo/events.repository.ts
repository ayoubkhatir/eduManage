import { and, eq, gte, lte } from "drizzle-orm";
import type { SQL } from "drizzle-orm";

import { db } from "../db.js";
import { classesTable, eventsTable, resourcesTable, subjectsTable } from "../schema.js";
import type { AddEventType, Event } from "#/types/eventsTypes.js";
import generateId from "#/lib/id_generator.js";

export async function createEvent(data: AddEventType): Promise<Event[]> {
  const payload = { ...data, id: generateId() };
  const rows = await db.insert(eventsTable).values(payload).returning();
  return rows;
}


export async function findEventById(id: string): Promise<Event | undefined> {
  return db.query.eventsTable.findFirst({
    where: eq(eventsTable.id, id),
  });
}

export async function listEvents(filters: {
  startDate?: string;
  endDate?: string;
  className?: string;
  courseId?: string;
} = {}): Promise<Event[]> {
  const conditions: SQL[] = [];

  if (filters.startDate) {
    conditions.push(gte(eventsTable.start, new Date(filters.startDate)));
  }

  if (filters.endDate) {
    conditions.push(lte(eventsTable.end, new Date(filters.endDate)));
  }

  if (filters.className) {
    const classData = await db.query.classesTable.findFirst({
      where: eq(classesTable.name, filters.className),
    })
    if (!classData) { return [] }
    conditions.push(eq(eventsTable.classId, classData.id));
  }

  if (filters.courseId !== undefined) {
    const courseData = await db.query.resourcesTable.findFirst({
      where: eq(resourcesTable.id, filters.courseId),
    })
    if (!courseData) return []
    const subjectData = await db.query.subjectsTable.findFirst({
      where: eq(subjectsTable.id, courseData.subjectId),
    })
    if (!subjectData) return [];
    conditions.push(eq(eventsTable.subjectId, subjectData.id));
  }

  if (conditions.length === 0) {
    return db.query.eventsTable.findMany();
  }

  return db.query.eventsTable.findMany({
    where: and(...conditions),
  });
}

export async function updateEvent(
  id: string,
  data: Partial<AddEventType>,
): Promise<Event | undefined> {
  const [row] = await db
    .update(eventsTable)
    .set(data)
    .where(eq(eventsTable.id, id))
    .returning();
  return row;
}

export async function deleteEvent(id: string): Promise<Event | undefined> {
  const [row] = await db.delete(eventsTable).where(eq(eventsTable.id, id)).returning();
  return row;
}
