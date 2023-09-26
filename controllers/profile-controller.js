import User from '../models/user.js';
import logger from '../logger.js';
import decodeAuthHeaderJWT from '../constants/jwtdecoder.js';

const profileController = {
	setInfo: async (request, response, next) => {
		const authHeader = request.headers.authorization;
		let user;
		try {
			user = await decodeAuthHeaderJWT(authHeader);
		} catch (err) {
			return response.status(404).send('Non existing user.');
		}
		const fields = { ...request.body };
		const restirectedFields = ['_id', '__v', 'id', 'euro', 'usd'];

		let filteredUF = {};
		Object.keys(fields).forEach((field) => {
			if (
				restirectedFields.indexOf(field) === -1 &&
				Object.keys(User.schema.tree).indexOf(field) >= 0
			) {
				filteredUF[field] = fields[field];
			}
		});

		await User.findOneAndUpdate({ email: user.email }, filteredUF);

		logger.info('User updated.');
		return response.status(201).json({ message: 'User updated.' });
	},
	getInfo: async (request, response, next) => {
		const authHeader = request.headers.authorization;
		let user;
		try {
			user = await decodeAuthHeaderJWT(authHeader);
		} catch (err) {
			return response.status(404).send('Non existing user.');
		}
		const { id } = request.params;

		const foundUser = await User.findById(id, '-password');

		logger.info('User updated.');
		return response.status(200).json(foundUser.toObject({ getters: true }));
	},
	setMoney: async (request, response, next) => {
		const authHeader = request.headers.authorization;
		let user;
		try {
			user = await decodeAuthHeaderJWT(authHeader);
		} catch (err) {
			return response.status(404).send('Non existing user.');
		}
		// const { age, city, country, role, name } = request.body;
		const { id } = request.params;
		const fields = { ...request.body };
		const allowedFields = ['euro', 'usd'];

		let filteredUF = {};
		Object.keys(fields).forEach((field) => {
			if (
				allowedFields.indexOf(field) >= 0 &&
				Object.keys(User.schema.tree).indexOf(field) >= 0
			) {
				filteredUF[field] = fields[field];
			}
		});

		await User.findByIdAndUpdate(id, filteredUF);

		logger.info('set money.');
		return response.status(201).json({ message: 'Money updated.' });
	},
	getMoney: async (request, response, next) => {
		const authHeader = request.headers.authorization;
		let user;
		try {
			user = await decodeAuthHeaderJWT(authHeader);
		} catch (err) {
			return response.status(404).send('Non existing user.');
		}
		const { id } = request.params;

		const userMoney = await User.findById(id, 'usd euro -_id');

		logger.info('got money.');
		return response.status(201).json(userMoney);
	},
	transferEURO: async (request, response, next) => {
		const authHeader = request.headers.authorization;
		let user;
		try {
			user = await decodeAuthHeaderJWT(authHeader);
		} catch (err) {
			return response.status(404).send('Non existing user.');
		}
		const { id: recipient_id } = request.params;
		const { value } = request.body;

		if (user?.euro < value) {
			return response.status(404).send('Exciding limits.');
		}

		await User.findByIdAndUpdate(
			user.id,
			{ $inc: { euro: -Math.abs(value) } },
			{
				upsert: true,
				new: true,
			}
		);

		await User.findByIdAndUpdate(
			recipient_id,
			{ $inc: { euro: Math.abs(value) } },
			{
				upsert: true,
				new: true,
			}
		);

		logger.info('transfered euro.');
		return response
			.status(201)
			.json({ message: `Send ${Math.abs(value)} Euro` });
	},
	transferUSD: async (request, response, next) => {
		const authHeader = request.headers.authorization;
		let user;
		try {
			user = await decodeAuthHeaderJWT(authHeader);
		} catch (err) {
			return response.status(404).send('Non existing user.');
		}
		const { id: recipient_id } = request.params;
		const { value } = request.body;

		if (user?.usd < value) {
			return response.status(404).send('Exciding limits.');
		}

		await User.findByIdAndUpdate(
			user.id,
			{ $inc: { usd: -Math.abs(value) } },
			{
				upsert: true,
				new: true,
			}
		);

		await User.findByIdAndUpdate(
			recipient_id,
			{ $inc: { usd: Math.abs(value) } },
			{
				upsert: true,
				new: true,
			}
		);

		logger.info('Transfered usd.');
		return response
			.status(201)
			.json({ message: `Send ${Math.abs(value)} US dollars` });
	},

	convertMoney: async (request, response, next) => {
		const authHeader = request.headers.authorization;
		let user;
		try {
			user = await decodeAuthHeaderJWT(authHeader);
		} catch (err) {
			return response.status(404).send('Non existing user.');
		}
		const { currencyFrom, value, currencyTo } = request.body;

		if (user?.[currencyFrom] < value) {
			return response.status(404).send('Exciding limits.');
		}
		const conversion = {
			usd_euro: 0.94,
			euro_usd: 1.06,
		};

		await User.findByIdAndUpdate(
			user.id,
			{
				$inc: {
					[currencyFrom]: -Math.abs(value),
					[currencyTo]: Math.abs(
						value * conversion[`${currencyFrom}_${currencyTo}`]
					),
				},
			},
			{
				upsert: true,
				new: true,
			}
		);

		logger.info('Converted.');
		return response.status(201).json({
			message: `Converted ${Math.abs(value)} ${currencyFrom} to ${
				value * conversion[`${currencyFrom}_${currencyTo}`]
			} ${currencyTo}`,
		});
	},
};
export default profileController;
