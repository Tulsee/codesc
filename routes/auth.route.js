import express from 'express';

import {getUser, login, register} from '../controllers/auth.controller.js'
import {authenticateToken} from "../middleware/authMiddleware.js";

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/user', authenticateToken, getUser)

export default router;