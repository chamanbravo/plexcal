import { format, createLogger, transports, Logger } from "winston";

const { timestamp, combine, printf, errors } = format;

const buildDevLogger = (): Logger => {
  const logFormat = printf(({ level, message, timestamp, stack }) => {
    return `${timestamp} [${level.toUpperCase()}] ${stack || JSON.stringify(message)}`;
  });

  return createLogger({
    format: combine(
      timestamp({ format: "HH:mm:ss" }),
      errors({ stack: true }),
      logFormat,
    ),
    transports: [new transports.Console()],
  });
};

export default buildDevLogger;
