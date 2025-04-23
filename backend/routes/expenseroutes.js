import express from 'express';
import { createExpense, getExpenses, deleteExpense, updateExpense } from '../controllers/expensecontroller.js';
import { authenticate } from '../middlewares/auth.js';

const router = express.Router();

router.post('/add', authenticate, createExpense);
router.get('/fetch', authenticate, getExpenses);
router.put('/update/:id', authenticate, updateExpense);
router.delete('/delete/:id', authenticate, deleteExpense);

export default router;

