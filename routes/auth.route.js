import express from 'express';

import {getUser, login, register, updateUser} from '../controllers/auth.controller.js'
import {authenticateToken} from "../middleware/authMiddleware.js";
import {authCheckRole} from "../middleware/auth.checkRole.js";

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/user', authenticateToken, getUser)
router.put('/user/:id', authenticateToken, authCheckRole('admin'), updateUser)

export default router;