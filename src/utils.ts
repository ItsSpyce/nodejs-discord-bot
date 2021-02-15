const COMMAND_PREFIX = process.env.COMMAND_PREFIX.trim() || '!';

export const getCommandPrefix = () => COMMAND_PREFIX;
