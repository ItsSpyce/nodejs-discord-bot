import { Client, Message } from 'discord.js';
import logger from './logger';
import { evalMessage } from './command-runner';
import { getCommandPrefix } from './utils';
import './env';
import './commands';

const { BOT_TOKEN } = process.env;
if (!BOT_TOKEN || BOT_TOKEN.length === 0) {
  throw new Error(
    'A valid bot token was not provided. For help on how to get this, check out https://discord.com/developers/docs/topics/oauth2#bots'
  );
}

const bot = new Client();
bot.on('ready', () => {
  logger.log('Bot ready');
});

const prefix = getCommandPrefix();

bot.on('message', async (message: Message) => {
  if (!message.content.startsWith(prefix)) return;
  await evalMessage(message);
});

bot.login(process.env.BOT_TOKEN);
