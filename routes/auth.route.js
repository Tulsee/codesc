import express from 'express';

import {deleteUser, getUser, googleAuthentication, login, register, updateUser} from '../controllers/auth.controller.js'
import {authenticateToken} from "../middleware/authMiddleware.js";
import {authCheckRole} from "../middleware/auth.checkRole.js";
import passport from 'passport';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/user', authenticateToken, getUser)
router.put('/user/:id', authenticateToken, authCheckRole('admin'), updateUser)
router.delete('/user/:id', authenticateToken, authCheckRole('admin'), deleteUser)

router.get('/google', passport.authenticate('google', {scope: ['profile', 'email']}))
router.get('/google/callback', passport.authenticate('google', {
    failureRedirect: '/',
}), googleAuthentication)

export default router;