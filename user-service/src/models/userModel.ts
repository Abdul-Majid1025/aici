import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function createUser(email: string, passwordHash: string) {
  const user = await prisma.user.create({
    data: {
      email,
      passwordHash,
    },
    select: {
      uuid: true,
      email: true,
    },
  });
  return user;
}

export async function findUserByEmail(email: string) {
  const user = await prisma.user.findUnique({
    where: { email },
  });
  return user;
}
