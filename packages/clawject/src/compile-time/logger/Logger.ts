import winston from 'winston';
import { ConfigLoader } from '../config/ConfigLoader';
import { performance } from 'perf_hooks';


export class Logger {
  private static logger = winston.createLogger({
    format: winston.format.combine(
      winston.format.colorize({ all: true }),
      winston.format.align(),
      winston.format.timestamp({ format: 'DD/MM/YYYY, HH:mm:ss' }),
      winston.format.label({ label: '[clawject]' }),
      winston.format.printf(({ level, message, meta, label, timestamp }) => {
        return `${label} - ${timestamp} [${level}] ${message}`;
      })
    ),
    level: ConfigLoader.get().logLevel,
    transports: [
      new winston.transports.Console(),
    ]
  });

  static info(message: string, details?: any) {
    this.logger.info(message, details);
  }

  static warn(message: string, details?: any) {
    this.logger.warn(message, details);
  }

  static error(message: string, details?: any) {
    this.logger.error(message, details);
  }

  static debug(message: string, details?: any) {
    this.logger.debug(message, details);
  }

  static verbose(message: string, details?: any) {
    this.logger.verbose(message, details);
  }

  private static levelToLabelToDuration: Map<string, Map<string, number>> = new Map();
  static verboseDuration(label: string) {
    if (this.logger.level !== 'verbose') {
      return;
    }
    this.withDuration('verbose', label);
  }

  private static withDuration(level: string, label: string) {
    const durationMap = this.levelToLabelToDuration.get(level) ?? new Map();

    if (!this.levelToLabelToDuration.has(level)) {
      this.levelToLabelToDuration.set(level, durationMap);
    }

    if (!durationMap.has(label)) {
      durationMap.set(label, performance.now());
    } else {
      const start = durationMap.get(label);
      durationMap.delete(label);
      const now = performance.now();
      this[level](`Duration of ${label}: ${now - start}ms`);
    }
  }
}
