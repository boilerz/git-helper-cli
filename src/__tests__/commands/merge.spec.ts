import { mocked } from 'ts-jest/utils';

import mergeCommand from '../../commands/merge';
import * as githubHelper from '../../helper/github';
import { displayOutput, runCommand } from '../helper';

jest.mock('../../helper/github');
const mockedGithubHelper = mocked(githubHelper, true);

describe('commands/merge', () => {
  beforeEach(() => {
    mockedGithubHelper.mergeMergeablePullRequests.mockReset();
  });

  it('should display help', async () => {
    const output = await displayOutput(mergeCommand, '--help');

    expect(output).toMatchInlineSnapshot(`
      "test [command]

      Commands:
        test merge [states]  Merge mergeable pull requests in your organisations
                                                                         [aliases: mg]

      Options:
        --help     Show help                                                 [boolean]
        --version  Show version number                                       [boolean]"
    `);
  });

  it('should not trigger a merge with no github setup', async () => {
    mockedGithubHelper.setup.mockReturnValue(false);
    mockedGithubHelper.mergeMergeablePullRequests.mockResolvedValue();

    await runCommand(mergeCommand, 'mg');

    expect(
      mockedGithubHelper.mergeMergeablePullRequests,
    ).not.toHaveBeenCalled();
  });

  it('should merge clean pr by default', async () => {
    mockedGithubHelper.setup.mockReturnValue(true);
    mockedGithubHelper.mergeMergeablePullRequests.mockResolvedValue();

    await runCommand(mergeCommand, 'mg');

    expect(mockedGithubHelper.mergeMergeablePullRequests.mock.calls)
      .toMatchInlineSnapshot(`
      Array [
        Array [
          Object {
            "mergeableStates": Array [
              "clean",
            ],
          },
        ],
      ]
    `);
  });

  it('should merge clean and unstable states', async () => {
    mockedGithubHelper.setup.mockReturnValue(true);
    mockedGithubHelper.mergeMergeablePullRequests.mockResolvedValue();

    await runCommand(mergeCommand, 'mg --states clean unstable');

    expect(mockedGithubHelper.mergeMergeablePullRequests.mock.calls)
      .toMatchInlineSnapshot(`
      Array [
        Array [
          Object {
            "mergeableStates": Array [
              "clean",
              "unstable",
            ],
          },
        ],
      ]
    `);
  });
});
