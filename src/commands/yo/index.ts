import { CommandModule } from 'yargs';

import handler, { Color, YoArguments } from './handler';

const colors: Color[] = ['red', 'blue', 'yellow'];

const command: CommandModule<Omit<YoArguments, 'color'>, YoArguments> = {
  describe: 'Say yo',
  command: 'yo <name> [color]',
  aliases: ['hello'],
  builder(args) {
    return args.option('color', {
      describe: 'Choose a color',
      choices: colors,
      default: 'blue',
    });
  },
  handler,
};

export { YoArguments, Color } from './handler';
export default command;
