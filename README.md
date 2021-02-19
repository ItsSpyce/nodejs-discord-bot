# NodeJS Discord Bot

> A template for creating a Discord bot with NodeJS

# Setup

This documentation is written with using Yarn as that's what I use. You're free to use NPM/PNPM or whatever else, just simply translate the commands accordingly. If there's a problem when using the package manager of your choice, open an issue and I'll address it as soon as possible.

1. Clone this repository
   `git clone https://github.com/ItsSpyce/nodejs-discord-bot.git`
2. Ensure you have a Discord bot registered through [the developer portal](https://discord.com/developers/applications).
3. Edit the .env files accordingly (further explanation below and in the .env file itself). Possible .env files follow [this standard](https://github.com/bkeepers/dotenv#what-other-env-files-can-i-use).
4. Add some commands, make a new profile picture, basically make the bot your own.
5. Run!

# Building

Build the bot with `yarn build`. This is only necessary when running in production as the bot uses `ts-node-dev` to run all TypeScript at runtime during development.

# Running

When running without Docker, you have 2 choices:

- `yarn start:dev`
- `yarn start:prod`

Both of these options will load their respective .env file and include specific logging.

If you're using Docker, just run `docker-compose up`.

# Development

## Creating a new command

To create a new command, inherit from the `Command` interface. This does not auto-register though, that is done with 1 of 2 ways:

- `command-runner.registerCommand`: this accepts either the function _or_ you can initialize a new instance of the command.
- the `command-runner.command` decorator. Much like the `registerCommand` function, you can pass arguments into this decorator to pass into the constructor function. This method requires you to add the command as an export to `./commands/index.ts`.
