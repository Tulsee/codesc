import express from 'express';
import { getPosts, createPost, getPostById, updatePost, deletePost } from '../controllers/post.controller.js';
import { authenticateToken } from '../middleware/authMiddleware.js';
import { authCheckRole } from '../middleware/auth.checkRole.js';

const router = express.Router();

router.get('', getPosts)
router.post('',authenticateToken, createPost)
router.get('/:id', authenticateToken, getPostById)
router.put('/:id', authenticateToken, updatePost)

router.delete('/:id', authenticateToken, authCheckRole('admin'), deletePost)

export default router;