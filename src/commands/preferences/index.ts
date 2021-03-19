import { CommandModule } from 'yargs';

import handler from './handler';

const command: CommandModule = {
  describe: 'Set preferences',
  command: 'preferences',
  aliases: ['p'],
  handler,
};

export default command;
