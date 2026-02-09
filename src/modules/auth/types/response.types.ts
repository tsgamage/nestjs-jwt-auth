import { Prisma } from '../../../generated/prisma/client.js';

export const authUserResponseSelect = {
  id: true,
  name: true,
  email: true,
  createdAt: true,
} satisfies Prisma.UserSelect;

export type IAuthUserResponse = Prisma.UserGetPayload<{
  select: typeof authUserResponseSelect;
}>;

export type IAuthStatusResponse = {
  ok: boolean;
};
