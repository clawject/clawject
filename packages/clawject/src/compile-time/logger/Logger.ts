import winston from 'winston';

const logger = winston.createLogger({
  format: winston.format.combine(
    winston.format.label({ label: 'Clawject' }),
    winston.format.timestamp({ format: 'DD/MM/YYYY, HH:mm:ss' }),
    winston.format.printf(({ level, message, meta, label, timestamp }) => {
      return `${label} - ${timestamp}     ${level.toUpperCase()} ${message}`;
    })
  ),
  transports: [
    new winston.transports.Console(),
  ]
});


export class Logger {
  static info(message: string, details?: any) {
    logger.info(message, details);
  }

  static warn(message: string, details?: any) {
    logger.warn(message, details);
  }

  static error(message: string, details?: any) {
    logger.error(message, details);
  }

  static debug(message: string, details?: any) {
    logger.debug(message, details);
  }
}
