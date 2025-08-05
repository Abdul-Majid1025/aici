import express from 'express';
import { authenticateToken } from '../middleware/auth';
import { create, getAll, update, remove } from '../controllers/todoControllers';

const router = express.Router();

router.use(authenticateToken);
router.post('/', create);
router.get('/', getAll);
router.patch('/:id', update);
router.delete('/:id', remove);

export default router;
