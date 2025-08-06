import request from 'supertest';
import jwt from 'jsonwebtoken';
import app from '../app';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const JWT_SECRET = process.env.JWT_SECRET || 'your_super_secret';

const testUser = {
  uuid: 'test-user-uuid',
  email: 'testuser@example.com'
};

function generateToken(user = testUser) {
  return jwt.sign(user, JWT_SECRET, { expiresIn: '1h' });
}

describe('Todo API', () => {
  let token: string;
  let todoId: number;

  beforeAll(async () => {
    token = generateToken();
    await prisma.todo.deleteMany({ where: { userUuid: testUser.uuid } });
  });

  afterAll(async () => {
    await prisma.todo.deleteMany({ where: { userUuid: testUser.uuid } });
    await prisma.$disconnect();
  });

  describe('POST /api/todos', () => {
    it('should create a todo for authenticated user', async () => {
      const res = await request(app)
        .post('/api/todos')
        .set('Authorization', `Bearer ${token}`)
        .send({ title: 'Test Todo', description: 'Test Desc' });
      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('id');
      expect(res.body).toHaveProperty('title', 'Test Todo');
      expect(res.body).toHaveProperty('userUuid', testUser.uuid);
      todoId = res.body.id;
    });

    it('should return 401 if JWT is missing', async () => {
      const res = await request(app)
        .post('/api/todos')
        .send({ title: 'No Auth', description: 'No Auth Desc' });
      expect(res.status).toBe(401);
    });

    it('should return 401 if JWT is invalid', async () => {
      const res = await request(app)
        .post('/api/todos')
        .set('Authorization', 'Bearer invalidtoken')
        .send({ title: 'Invalid', description: 'Invalid' });
      expect(res.status).toBe(401);
    });
  });

  describe('GET /api/todos', () => {
    it('should return todos for authenticated user', async () => {
      const res = await request(app)
        .get('/api/todos')
        .set('Authorization', `Bearer ${token}`);
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      res.body.forEach((todo: any) => {
        expect(todo.userUuid).toBe(testUser.uuid);
      });
    });

    it('should return empty array if user has no todos', async () => {
      const emptyToken = generateToken({ uuid: 'empty-user', email: 'empty@example.com' });
      const res = await request(app)
        .get('/api/todos')
        .set('Authorization', `Bearer ${emptyToken}`);
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBe(0);
    });

    it('should return 401 if JWT is missing', async () => {
      const res = await request(app).get('/api/todos');
      expect(res.status).toBe(401);
    });

    it('should return 401 if JWT is invalid', async () => {
      const res = await request(app)
        .get('/api/todos')
        .set('Authorization', 'Bearer invalidtoken');
      expect(res.status).toBe(401);
    });
  });

  describe('PATCH /api/todos/:id', () => {
    it('should update todo for owner', async () => {
      const res = await request(app)
        .patch(`/api/todos/${todoId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ title: 'Updated Title', status: 'done' });
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('title', 'Updated Title');
      expect(res.body).toHaveProperty('status', 'done');
    });

    it('should return 404 if todo does not exist', async () => {
      const res = await request(app)
        .patch('/api/todos/999999')
        .set('Authorization', `Bearer ${token}`)
        .send({ title: 'Nope' });
      expect(res.status).toBe(404);
    });

    it('should return 403 if not owner', async () => {
      const otherToken = generateToken({ uuid: 'other-user', email: 'other@example.com' });
      const res = await request(app)
        .patch(`/api/todos/${todoId}`)
        .set('Authorization', `Bearer ${otherToken}`)
        .send({ title: 'Hacker' });
      expect([403, 404]).toContain(res.status);
    });

    it('should return 401 if JWT is missing', async () => {
      const res = await request(app)
        .patch(`/api/todos/${todoId}`)
        .send({ title: 'No Auth' });
      expect(res.status).toBe(401);
    });

    it('should return 401 if JWT is invalid', async () => {
      const res = await request(app)
        .patch(`/api/todos/${todoId}`)
        .set('Authorization', 'Bearer invalidtoken')
        .send({ title: 'Invalid' });
      expect(res.status).toBe(401);
    });
  });

  describe('DELETE /api/todos/:id', () => {
    it('should delete todo for owner', async () => {
      const res = await request(app)
        .delete(`/api/todos/${todoId}`)
        .set('Authorization', `Bearer ${token}`);
      expect(res.status).toBe(204);
    });

    it('should return 404 if todo does not exist', async () => {
      const res = await request(app)
        .delete('/api/todos/999999')
        .set('Authorization', `Bearer ${token}`);
      expect(res.status).toBe(404);
    });

    it('should return 403 if not owner', async () => {
      const createRes = await request(app)
        .post('/api/todos')
        .set('Authorization', `Bearer ${token}`)
        .send({ title: 'To be stolen', description: '' });
      const newTodoId = createRes.body.id;
      const otherToken = generateToken({ uuid: 'other-user', email: 'other@example.com' });
      const res = await request(app)
        .delete(`/api/todos/${newTodoId}`)
        .set('Authorization', `Bearer ${otherToken}`);
      expect([403, 404]).toContain(res.status);
      await request(app)
        .delete(`/api/todos/${newTodoId}`)
        .set('Authorization', `Bearer ${token}`);
    });

    it('should return 401 if JWT is missing', async () => {
      const res = await request(app)
        .delete(`/api/todos/${todoId}`)
      expect(res.status).toBe(401);
    });

    it('should return 401 if JWT is invalid', async () => {
      const res = await request(app)
        .delete(`/api/todos/${todoId}`)
        .set('Authorization', 'Bearer invalidtoken');
      expect(res.status).toBe(401);
    });
  });
});