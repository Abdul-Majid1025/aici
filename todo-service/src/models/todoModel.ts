import { PrismaClient } from '@prisma/client';
import ApiError from '../errors/apiError';

const prisma = new PrismaClient();

export async function createTodo(title: string, description: string | null, userUuid: string) {
  return await prisma.todo.create({
    data: {
      title,
      description,
      userUuid
    }
  });
}

export async function getTodosByUser(userUuid: string) {
  return await prisma.todo.findMany({
    where: { userUuid },
    orderBy: { createdAt: 'desc' }
  });
}

export async function updateTodo(
  id: number,
  userUuid: string,
  fields: { title?: string; description?: string; status?: string }
) {
  const todo = await prisma.todo.findUnique({ where: { id } });

  if (!todo) {
    throw new ApiError('Todo not found', 404);
  }
  if (todo.userUuid !== userUuid) {
    throw new ApiError('Forbidden: You do not have access to this todo', 403);
  }

  return await prisma.todo.update({
    where: { id },
    data: {
      title: fields.title,
      description: fields.description,
      status: fields.status
    }
  });
}

export async function deleteTodo(id: number, userUuid: string) {
  const todo = await prisma.todo.findUnique({ where: { id } });

  if (!todo) {
    throw new ApiError('Todo not found', 404);
  }
  if (todo.userUuid !== userUuid) {
    throw new ApiError('Forbidden: You do not have access to this todo', 403);
  }

  return await prisma.todo.delete({ where: { id } });
}
