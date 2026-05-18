import {getUsersSchema , addUserSchema , editUserSchema } from '#/schemas/users.schema';

import z from 'zod'



export type getUsersSchema = z.infer<typeof getUsersSchema>;

export type addUserSchema = z.infer<typeof addUserSchema>;

export type editUserSchema = z.infer<typeof editUserSchema>;