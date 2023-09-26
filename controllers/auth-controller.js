import { validationResult } from 'express-validator';
import User from '../models/user.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import logger from '../logger.js';

const authController = {
	register: async (request, response, next) => {
		const errors = validationResult(request);
		if (!errors.isEmpty()) {
			logger.error(
				`Invalid inputs passed, place check your data.\n ${JSON.stringify(
					errors
				)}`,
				{
					at: new Error(),
				}
			);
			response
				.status(422)
				.send('Invalid inputs passed, place check your data.');
		}

		const { name, email, password } = request.body;

		if (!email || !password) {
			logger.error('Email and password are required.', {
				at: new Error(),
			});
			response.status(400).send('Email and password are required.');
		}

		const existingUser = await User.findOne({ email });

		if (existingUser) {
			logger.error('Email already exists.', {
				at: new Error(),
			});
			response.status(400).send('Email already exists.');
		}

		const hashedPassword = await bcrypt.hash(password, +process.env.SALT);

		const registeredUser = new User({
			name,
			email,
			password: hashedPassword,
			role: 'user',
		});

		try {
			await registeredUser.save();
		} catch (err) {
			logger.error('Registration of user failed.', {
				at: new Error(),
			});
			response.status(500).send('Registration of user failed.');
		}

		logger.info('User registered.');
		response.status(201).json(registeredUser);
	},
	login: async (request, response, next) => {
		const errors = validationResult(request);
		if (!errors.isEmpty()) {
			logger.error(
				`Invalid inputs passed, place check your data.\n ${JSON.stringify(
					errors
				)}`,
				{
					at: new Error(),
				}
			);
			response
				.status(422)
				.send('Invalid inputs passed, place check your data.');
		}

		const { email, password } = request.body;

		if (!email || !password) {
			logger.error('Email and password are required.', {
				at: new Error(),
			});
			response.status(400).send('Email and password are required.');
		}

		const existingUser = await User.findOne({ email });

		if (!existingUser) {
			logger.error('Invalid credentials.', {
				at: new Error(),
			});
			response.status(400).send('Invalid credentials.');
		}

		const passwordMatch = await bcrypt.compare(
			password,
			existingUser.password
		);

		if (!passwordMatch) {
			logger.error('Invalid credentials.', {
				at: new Error(),
			});
			response.status(401).send('Invalid credentials.');
		}

		try {
			const token = jwt.sign(
				{ email: existingUser.email },
				process.env.ACCESS_TOKEN_PRIVATE_KEY,
				{ expiresIn: '1h' }
			);
			logger.info('Logged in successfully');
			response.json({ token });
		} catch (err) {
			console.log(err);
			logger.error('Login failed.\n' + JSON.stringify(err), {
				at: new Error(),
			});
			response.status(500).send('Login failed.');
		}
	},
};
export default authController;
