import { Command, CommandArgs } from 'app-env';
import { getCommandPrefix } from '../utils';
import { getCommands } from '../command-runner';

type HelpArgs = {
  topic?: string;
};

export default class HelpCommand implements Command<HelpArgs> {
  readonly name = 'help';
  readonly description = 'Returns a list of commands';
  readonly format = '?topic';

  async exec(args: CommandArgs<HelpArgs>) {
    const commandPrefix = getCommandPrefix();
    const commands = getCommands(args.params.topic);
    const helpPage = commands.reduce(
      (result, command) =>
        `${result}\n**${command.name}**: \`${commandPrefix}${command.name} ${
          command.format || ''
        }\` ${command.description}`,
      ''
    );
    await args.message.author.send(
      `Below is the directory of commands. Arguments prepended with "?" are not required.\n${helpPage}`
    );
  }
}
