import buildDevLogger from "./devLogger";
import buildProdLogger from "./prodLogger";
import type { Logger } from "winston";

let logger: Logger;

if (process.env.NODE_ENV === "development") {
  logger = buildDevLogger();
} else {
  logger = buildProdLogger();
}

export default logger;
