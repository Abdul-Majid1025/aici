import { NextFunction, Request, Response } from 'express';
import { createTodo, deleteTodo, getTodosByUser, updateTodo } from '../models/todoModel';
import { AuthRequest } from '../middleware/auth';

export async function create(req: AuthRequest, res: Response) {
  const { title, description } = req.body;
  const user_uuid = req.user?.uuid;
  const todo = await createTodo(title, description, user_uuid!);
  res.status(201).json(todo);
}

export async function getAll(req: AuthRequest, res: Response) {
  const todos = await getTodosByUser(req.user!.uuid);
  res.json(todos);
}

export async function update(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const todo = await updateTodo(Number(req.params.id), req.user!.uuid, req.body);
    res.json(todo);
  } catch (err) {
    next(err);
  }
}

export async function remove(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    await deleteTodo(Number(req.params.id), req.user!.uuid);
    res.sendStatus(204);
  } catch (err) {
    next(err);
  }
}
