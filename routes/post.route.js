import express from 'express';
import { getPosts, createPost, getPostById } from '../controllers/post.controller.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('', getPosts)
router.post('',authenticateToken, createPost)
router.get('/:id', authenticateToken, getPostById)

export default router;