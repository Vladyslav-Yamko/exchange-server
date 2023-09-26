import mongoose from 'mongoose';
import express from 'express';
import authRoutes from './routes/auth-routes.js';
import bodyParser from 'body-parser';
import logger from './logger.js';
import statusRoutes from './routes/status-routes.js';
import cors from 'cors';
import profileRoutes from './routes/profile-routes.js';

const app = express();
const port = 7777;

app.use(bodyParser.json({}));

app.use(cors());
app.use('/api/health', statusRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);

mongoose
	.connect(`${process.env.MONGODB_CONNECTION}`)
	.then(() => {
		app.listen(port, () => logger.info(`Server listening on port ${port}`));
	})
	.catch((error) => {
		logger.error(`Could not connect to DB\n${error}`, { at: new Error() });
	});
