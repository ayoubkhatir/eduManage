import { eq } from "drizzle-orm";
import { db, type Database } from "../db.js";
import { usersTable } from "../schema.js";
import type { NewUser, User } from "#/server/types.js";


export interface IUsersRepository {
  createUser(data: NewUser): Promise<User>
  findUserById(id: string): Promise<User | undefined>
  findUserByUsername(username: string): Promise<User | undefined>
  findUserByEmail(email: string): Promise<User | undefined>
  updateUser(id: string, data: Partial<NewUser>): Promise<User | undefined>
}

class UsersRepository implements IUsersRepository {
  constructor(private readonly db: Database) { }

  async createUser(data: NewUser): Promise<User> {
    const [row] = await this.db.insert(usersTable).values(data).returning();
    return row;
  }

  async findUserById(id: string): Promise<User | undefined> {
    return this.db.query.usersTable.findFirst({
      where: eq(usersTable.id, id),
    });
  }

  async findUserByEmail(email: string): Promise<User | undefined> {
    return this.db.query.users.findFirst({
      where: eq(usersTable.email, email),
    });
  }

  async findUserByUsername(
    username: string,
  ): Promise<User | undefined> {
    return this.db.query.users.findFirst({
      where: eq(usersTable.username, username),
    });
  }

  async updateUser(
    id: string,
    data: Partial<NewUser>,
  ): Promise<User | undefined> {
    const [row] = await this.db
      .update(usersTable)
      .set(data)
      .where(eq(usersTable.id, id))
      .returning();
    return row;
  }

  async deleteUser(id: string): Promise<void> {
    await this.db.delete(usersTable).where(eq(usersTable.id, id));
  }
}

export const usersRepository = new UsersRepository(db);

