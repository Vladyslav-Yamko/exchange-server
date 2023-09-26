import logger from '../logger.js';

const statusController = {
	health: async (request, response, next) => {
		const data = {
			uptime: process.uptime(),
			message: 'Ok',
			date: new Date(),
		};

		logger.info('Checked health');
		response.status(200).send(data);
	},
};
export default statusController;
