import { eq } from "drizzle-orm";
import { db, type Database } from "../db.js";
import { users } from "../schema.js";
import type { AuthUser, newAuthUser } from "#/types/authTypes.js";

// the types here should be updated.there is no more user and newUser types

export interface IUsersRepository {
  createUser(data: newAuthUser): Promise<AuthUser[]>
  findUserById(id: string): Promise<AuthUser | undefined>
  findUserByUsername(username: string): Promise<AuthUser | undefined>
  findUserByEmail(email: string): Promise<AuthUser | undefined>
  updateUser(id: string, data: Partial<newAuthUser>): Promise<AuthUser | undefined>
  deleteUser(id: string): Promise<AuthUser | undefined>
}

class UsersRepository implements IUsersRepository {
  constructor(private readonly db: Database) { }

  
  async createUser(data: newAuthUser): Promise<AuthUser[]> {
  
    // the id generation should be handled in the database i guess.

    const payload = { ...data, id: crypto.randomUUID() };
    const rows = await this.db.insert(users).values(payload).returning();
    return rows;
  }

  async findUserById(id: string): Promise<AuthUser | undefined> {
    return this.db.query.users.findFirst({
      where: eq(users.id, id),
    });
  }

  async findUserByEmail(email: string): Promise<AuthUser | undefined> {
    return this.db.query.users.findFirst({
      where: eq(users.email, email),
    });
  }

  async findUserByUsername(
    username: string,
  ): Promise<AuthUser | undefined> {
    return this.db.query.users.findFirst({
      where: eq(users.name, username),
    });
  }

  async updateUser(
    id: string,
    data: Partial<newAuthUser>,
  ): Promise<AuthUser | undefined> {
    const [row] = await this.db
      .update(users)
      .set(data)
      .where(eq(users.id, id))
      .returning();
    return row;
  }

  async deleteUser(id: string): Promise<AuthUser | undefined> {
    const [row] = await this.db.delete(users).where(eq(users.id, id)).returning();
    return row;
  }
}

export const usersRepository = new UsersRepository(db);
