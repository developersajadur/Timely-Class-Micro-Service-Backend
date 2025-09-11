import { User } from '@prisma/client';

const withoutPassword = (user: User) => {
  const { password, ...rest } = user;
  return rest;
};

export default withoutPassword;
