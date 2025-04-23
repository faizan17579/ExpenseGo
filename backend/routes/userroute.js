import express from 'express';

import { signup, login } from '../controllers/usercontroller.js';
import { authenticate } from '../middlewares/auth.js';

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.get('/profile', authenticate, (req, res) => {
    res.status(200).json({ message: 'Profile fetched successfully', user: req.user });
});




export default router;
