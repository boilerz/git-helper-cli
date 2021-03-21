import * as octokit from '@octokit/rest';
import { mocked } from 'ts-jest/utils';

import * as githubHelper from '../../helper/github';
import { mockOctokit } from '../helper';

jest.mock('@octokit/rest');

const mockedOctokit = mocked(octokit, true);

describe('helper/github', () => {
  beforeEach(() => {
    process.env.GITHUB_TOKEN = 'github.token';
  });
  afterEach(() => {
    delete process.env.GITHUB_TOKEN;
  });

  describe('#setup', () => {
    it('should return false when no token is found', () => {
      delete process.env.GITHUB_TOKEN;

      expect(githubHelper.setup()).toBe(false);
    });

    it('should return true when no token is found', () => {
      process.env.GITHUB_TOKEN = 'github.token';

      expect(githubHelper.setup()).toBe(true);
      expect(mockedOctokit.Octokit.mock.calls).toMatchInlineSnapshot(`
        Array [
          Array [
            Object {
              "auth": "github.token",
            },
          ],
        ]
      `);
    });
  });

  describe('#mergeMergeablePullRequests', () => {
    it('should handle no mergeable prs', async () => {
      const octokitInstance = mockOctokit(mockedOctokit);

      const logSpy = jest.spyOn(console, 'log');
      const issuesAndPullRequestsSpy = octokitInstance.search.issuesAndPullRequests.mockResolvedValue(
        {
          data: {
            items: [],
          },
        },
      );

      await githubHelper.mergeMergeablePullRequests();

      expect(issuesAndPullRequestsSpy).not.toHaveBeenCalled();
      expect(logSpy.mock.calls).toMatchInlineSnapshot(`
        Array [
          Array [
            "No organisations set",
          ],
          Array [
            "🔀 No PR found",
          ],
        ]
      `);
    });
  });
});
