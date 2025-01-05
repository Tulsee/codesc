import express from 'express';
import { getPosts, createPost } from '../controllers/post.controller.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('', getPosts)
router.post('',authenticateToken, createPost)

export default router;