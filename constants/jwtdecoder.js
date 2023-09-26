import jwt from 'jsonwebtoken';
import User from '../models/user.js';
import logger from '../logger.js';

const decodeAuthHeaderJWT = async (authHeader) => {
	if (authHeader?.startsWith('Bearer ')) {
		const TokenArray = authHeader.split(' ');
		const decodedToken = jwt.decode(TokenArray[1]);
		return await getUserByEmail(decodedToken.email);
	}
	logger.error('Wrong header.', {
		at: new Error(),
	});
	return new HttpError('Wrong header.', 404);
};

const getUserByEmail = async (email) => {
	const user = await User.findOne({ email });
	if (!user) {
		logger.error('Wrong bearer.', {
			at: new Error(),
		});
		return new HttpError('Wrong bearer.', 404);
	}
	return user.toObject({ getters: true });
};

export default decodeAuthHeaderJWT;
