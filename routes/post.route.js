import express from 'express';
import { getPosts, createPost, getPostById, updatePost } from '../controllers/post.controller.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('', getPosts)
router.post('',authenticateToken, createPost)
router.get('/:id', authenticateToken, getPostById)
router.put('/:id', authenticateToken, updatePost)

export default router;