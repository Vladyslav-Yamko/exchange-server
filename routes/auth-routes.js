import express from 'express';
import { check } from 'express-validator';
import authController from '../controllers/auth-controller.js';

const router = express.Router();

router.post(
	'/register',
	[
		check('email').normalizeEmail().isEmail(),
		check('password').isLength({ min: 6 }),
	],
	authController.register
);

router.post(
	'/login',
	[
		check('email').normalizeEmail().isEmail(),
		check('password').isLength({ min: 6 }),
	],
	authController.login
);

const authRoutes = router;

export default authRoutes;
