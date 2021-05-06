import { MaybeMockedDeep } from 'ts-jest/dist/utils/testing';
import yargs, { Argv, CommandModule } from 'yargs';

import * as githubHelper from '../helper/github';

export async function runCommand(
  command: CommandModule<any, any>,
  args: string,
): Promise<void> {
  await yargs.scriptName('test').command(command).parse(args);
}

export function displayOutput(
  command: CommandModule<any, any>,
  args: string,
): Promise<string> {
  return new Promise((resolve, reject) => {
    try {
      yargs
        .scriptName('test')
        .command(command)
        .exitProcess(false)
        .detectLocale(false)
        .parse(args, (err: Error, argv: Argv<{}>, output: string) => {
          resolve(output);
        });
    } catch (err) {
      reject(err);
    }
  });
}

export function mockOctokit(mockedOctokit: MaybeMockedDeep<unknown>) {
  const octokitInstance = {
    search: {
      issuesAndPullRequests: jest.fn(),
    },
  };
  // @ts-ignore mock
  mockedOctokit.Octokit.mockReturnValue(octokitInstance);
  githubHelper.setup();
  return octokitInstance;
}
