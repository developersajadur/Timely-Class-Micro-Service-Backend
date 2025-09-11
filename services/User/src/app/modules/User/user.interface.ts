import { Role } from '@prisma/client';

export interface IUser {
  id: string;
  name: string;
  email: string;
  password: string;
  role: Role;
  isDeleted: boolean;
  isBlocked: boolean;
  createdAt: Date;
  updatedAt: Date;
}
