import express from 'express';

import { authenticate } from '../middlewares/auth.js';
import { createBudget, getBudgets, updateBudget, deleteBudget } from '../controllers/bugetcontroller.js';

const router = express.Router();

router.post('/add', authenticate, createBudget);
router.get('/fetch', authenticate, getBudgets);
router.put('/update/:id', authenticate, updateBudget);
router.delete('/delete/:id', authenticate, deleteBudget);


export default router;






