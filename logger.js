import winston, { format } from 'winston';
const { combine, timestamp, printf, colorize } = format;

const myFormat = printf(({ level, message, timestamp, at }) => {
	if (at) {
		let on = at.stack.split('\n')[1].slice(7).split('/').pop();
		let file = on.split(':')[0];
		let line = on.split(':')[1];
		return `[${timestamp}] | file: ${file}, line: ${line} | ${level}: ${message}`;
	}
	return `[${timestamp}] | ${level}: ${message}`;
});

const logger = winston.createLogger({
	level: 'info',
	format: combine(colorize(), timestamp(), myFormat),
	transports: [new winston.transports.Console()],
});

export default logger;
