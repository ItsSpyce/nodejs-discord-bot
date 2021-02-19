// taken from https://github.com/facebook/create-react-app/blob/master/packages/react-scripts/config/env.js because it's a handy and short way of handling this situation
import fs from 'fs';
import dotenvExpand from 'dotenv-expand';
import { config } from 'dotenv';
import logger from './logger';

const { NODE_ENV } = process.env;
if (!NODE_ENV) {
  throw new Error('NODE_ENV required');
}

const dotenvFilename = '.env';

const dotenvFiles = [
  `${dotenvFilename}.${NODE_ENV}.local`,
  NODE_ENV !== 'test' && `${dotenvFilename}.local`,
  `${dotenvFilename}.${NODE_ENV}`,
  dotenvFilename,
].filter(Boolean);

dotenvFiles.forEach((dotenvFile) => {
  if (fs.existsSync(dotenvFile)) {
    const { error } = dotenvExpand(config({ path: dotenvFile }));
    if (error) {
      logger.error(`Failed to parse ${dotenvFile}: ${error}`);
    } else {
      logger.debug(`Loaded env file ${dotenvFile}`);
    }
  } else {
    logger.debug(`Could not find ${dotenvFile}, skipping`);
  }
});
