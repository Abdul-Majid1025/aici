import express from 'express';
import dotenv from 'dotenv';
import todoRoutes from './routes/todoRoutes';
import errorHandler from './middleware/errorHandler';

dotenv.config();

const app = express();
app.use(express.json());
app.use('/api/todos', todoRoutes);
app.use(errorHandler);

export default app;
