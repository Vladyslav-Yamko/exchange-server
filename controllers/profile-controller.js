import { validationResult } from 'express-validator';
import User from '../models/user.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import logger from '../logger.js';
import decodeAuthHeaderJWT from '../constants/jwtdecoder.js';

const profileController = {
	setInfo: async (request, response, next) => {
		const authHeader = request.headers.authorization;
		let user;
		try {
			user = await decodeAuthHeaderJWT(authHeader);
		} catch (err) {
			response.status(404).send('Non existing user.');
		}
		const { age, city, country, role, name } = request.body;

		const updatedFields = {
			age,
			city,
			country,
			role,
			name,
		};
		let filteredUF = Object.fromEntries(
			Object.entries(updatedFields).filter(([_, v]) => v != null)
		);
		await User.findOneAndUpdate({ email: user.email }, filteredUF);

		logger.info('User updated.');
		response.status(200).json({ message: 'User updated.' });
	},
};
export default profileController;
