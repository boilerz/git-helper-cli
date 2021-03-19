import { CommandModule } from 'yargs';

import { MergeableState } from '../../helper/github';
import handler, { MergeArguments } from './handler';

const status: MergeableState[] = ['clean', 'unstable'];
const defaultStatuses: MergeableState[] = ['clean'];

const command: CommandModule<MergeArguments, MergeArguments> = {
  describe: 'Merge mergeable pull requests in your organisations',
  command: 'merge [states]',
  aliases: ['mg'],
  builder(args) {
    return args.option('states', {
      describe: 'Choose pr states',
      choices: status,
      array: true,
      default: defaultStatuses,
    });
  },
  handler,
};

export { MergeArguments } from './handler';
export default command;
