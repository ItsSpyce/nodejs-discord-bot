import { Command, Constructor } from 'app-env';
import _ from 'lodash';
import { Message } from 'discord.js';
import logger from './logger';

type FormatParam = {
  name: string;
  optional: boolean;
};

const registeredCommands = new Map<string, Command>();
const commandFormats = new Map<string, FormatParam[]>();
const formatParamRegex = /\??[a-z_-]/gi;

export function registerCommand(command: Command | Constructor<Command>) {
  const instance: Command =
    typeof command === 'function' ? new command() : command;
  if (registeredCommands.has(instance.name)) {
    logger.error(`${instance.name} is already registered`);
    return;
  }
  registeredCommands.set(instance.name, instance);
  const format = instance.format || '';
  try {
    const formatMap = buildFormatMap(format);
    commandFormats.set(instance.name, formatMap);
    logger.success(`Registered command ${instance.name}`);
  } catch (err) {
    logger.error(`Failed to register ${instance.name} - ${err.message}`);
  }
}

function buildFormatMap(format: string) {
  const order: FormatParam[] = [];
  if (format.length === 0) return order;
  const doesParamExist = (param: string) =>
    !_.every(
      order,
      (formatParam) => formatParam.name.toLowerCase() !== param.toLowerCase()
    );
  let isReadingOptional = false;

  const params = format.split(' ');
  for (let param of params) {
    if (!formatParamRegex.test(param)) {
      throw new Error(`Invalid format param: ${param}`);
    }
    const isOptional = param.startsWith('?');
    const name = isOptional ? param.substr(1) : param;
    if (doesParamExist(name)) {
      throw new Error(`Duplicate param found: ${name}`);
    }
    if (!isOptional) {
      if (isReadingOptional) {
        throw new Error('Cannot have a required argument after an optional');
      }
      order.push({ name, optional: false });
    } else {
      isReadingOptional = true;
      order.push({ name, optional: true });
    }
  }
  return order;
}

function parseFormattedArgs(name: string, args: string) {
  if (args.length === 0) return {};
  // pull variables out
  const formatMap = commandFormats.get(name);
  if (!formatMap) return {};
  const parsedArgs: string[] = [];
  let currentArg = '';
  let isReadingString = false;
  const parts = args.split(' ');
  for (let i = 0; i < parts.length; ++i) {
    const part = parts[i];
    if (isReadingString) {
      if (part.endsWith('"') && part[part.length - 2] !== '\\') {
        currentArg = `${currentArg} ${part.substr(0, part.length - 2)}`;
        parsedArgs.push(`${currentArg}`);
        currentArg = '';
        isReadingString = false;
      } else {
        currentArg = `${currentArg} ${part}`;
      }
    } else {
      if (part.startsWith('"')) {
        isReadingString = true;
        currentArg = part.substr(1);
      } else {
        parsedArgs.push(part);
      }
    }
  }
  if (isReadingString) {
    throw new Error('Unterminated string');
  }
  const argsWithNames = parsedArgs.reduce(
    (map, arg, i) => ({ ...map, [formatMap[i]?.name]: arg }),
    Object.create(null)
  );
  for (let argFormat of formatMap) {
    if (!argFormat.optional && argsWithNames[argFormat.name]) {
      throw new Error(`Parameter required: ${argFormat.name}`);
    }
  }
  // a small hack so I don't have to worry about filtering during the reduce. Too lazy
  delete argsWithNames.undefined;
  return argsWithNames;
}

export async function evalMessage(message: Message) {
  const { content } = message;
  const indexOfSpace = content.indexOf(' ');
  const name = content.substr(
    1,
    indexOfSpace > -1 ? indexOfSpace - 1 : content.length - 1
  );
  const args = content.substr(name.length + 2);
  const params = parseFormattedArgs(name, args);
  const command = registeredCommands.get(name);
  if (!command) {
    return;
  }
  logger.debug(`Executing command ${name}`);
  await command.exec({ message, params });
}

export function getCommands(topic?: string) {
  return Array.from(registeredCommands.values()).filter(
    (cmd) => !topic || cmd.name.indexOf(topic) > -1
  );
}
