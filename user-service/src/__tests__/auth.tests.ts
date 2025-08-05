import request from 'supertest';
import app from '../app';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

describe('User Registration and Login', () => {
  const testEmail = `testuser_${Date.now()}@example.com`;
  const testPassword = 'password123';

  afterAll(async () => {
    await prisma.user.deleteMany({ where: { email: testEmail } });
    await prisma.$disconnect();
  });

  describe('POST /api/users/register', () => {
    it('should register a new user with valid email and password', async () => {
      const res = await request(app)
        .post('/api/users/register')
        .send({ email: testEmail, password: testPassword });
      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('uuid');
      expect(res.body).toHaveProperty('email', testEmail);
      expect(res.body).not.toHaveProperty('passwordHash');
    });

    it('should not register with an existing email', async () => {
      await request(app)
        .post('/api/users/register')
        .send({ email: testEmail, password: testPassword });
      const res = await request(app)
        .post('/api/users/register')
        .send({ email: testEmail, password: testPassword });
      expect(res.status).toBe(409);
      expect(res.body).toHaveProperty('message', 'Email already registered');
    });

    it('should not register with invalid email', async () => {
      const res = await request(app)
        .post('/api/users/register')
        .send({ email: 'invalid', password: testPassword });
      expect(res.status).toBe(400);
    });

    it('should not register with short password', async () => {
      const res = await request(app)
        .post('/api/users/register')
        .send({ email: `shortpw_${Date.now()}@example.com`, password: '123' });
      expect(res.status).toBe(400);
    });

    it('should not register with missing fields', async () => {
      const res = await request(app)
        .post('/api/users/register')
        .send({ email: testEmail });
      expect(res.status).toBe(400);
    });
  });

  describe('POST /api/users/login', () => {
    beforeAll(async () => {
      await request(app)
        .post('/api/users/register')
        .send({ email: testEmail, password: testPassword });
    });

    it('should login with correct credentials and return JWT', async () => {
      const res = await request(app)
        .post('/api/users/login')
        .send({ email: testEmail, password: testPassword });
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('token');
    });

    it('should not login with wrong password', async () => {
      const res = await request(app)
        .post('/api/users/login')
        .send({ email: testEmail, password: 'wrongpassword' });
      expect(res.status).toBe(401);
      expect(res.body).toHaveProperty('message', 'Invalid credentials');
    });

    it('should not login with non-existent email', async () => {
      const res = await request(app)
        .post('/api/users/login')
        .send({ email: 'notfound@example.com', password: 'password123' });
      expect(res.status).toBe(401);
      expect(res.body).toHaveProperty('message', 'Invalid credentials');
    });

    it('should not expose password in response', async () => {
      const res = await request(app)
        .post('/api/users/login')
        .send({ email: testEmail, password: testPassword });
      expect(res.body).not.toHaveProperty('password');
      expect(res.body).not.toHaveProperty('passwordHash');
    });
  });
});