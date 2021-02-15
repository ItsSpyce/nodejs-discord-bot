/// <reference types="node" />

import { Message } from 'discord.js';

declare type Constructor<T> = new (...args: any[]) => T;

declare type CommandArgs<T = unknown> = {
  message: Message;
  params: T;
};

declare interface Command<T = unknown> {
  name: string;
  description: string;
  format?: string;
  exec(args: CommandArgs<T>): Promise<void>;
}
