import { Octokit, RestEndpointMethodTypes } from '@octokit/rest';
import chalk from 'chalk';
import ora from 'ora';

import preferencesStore from './preferencesStore';

export type IssueSearchResultItems =
  RestEndpointMethodTypes['search']['issuesAndPullRequests']['response']['data']['items'];
export type PullRequest =
  RestEndpointMethodTypes['pulls']['get']['response']['data'];
const DEFAULT_PER_PAGE = 100;
let octokit: Octokit;

export function setup(): boolean {
  const githubTokenEnvVar = preferencesStore.get('githubTokenEnvVar');
  const token = process.env[githubTokenEnvVar];
  if (!token) {
    console.log(chalk.bold.yellow('🔑 Missing github token.'));
    console.log(
      chalk.italic.blue(
        `Please set the token at ${chalk.yellow(
          githubTokenEnvVar,
        )} or update env var key using ${chalk.red('-p')} option.`,
      ),
    );
    return false;
  }

  octokit = new Octokit({
    auth: token,
  });
  return true;
}

function getUserOrganisationNames(): string[] {
  const organisations = preferencesStore.get('organisations');
  if (organisations.length === 0) {
    console.log(chalk.yellow('No organisations set'));
    return [];
  }
  return organisations;
}

export async function checkOrganisationExistence(
  organisationName: string,
): Promise<boolean> {
  try {
    const { status } = await octokit.orgs.get({ org: organisationName });
    return status === 200;
  } catch (err) {
    return false;
  }
}

async function getPullRequest(
  owner: string,
  repo: string,
  number: number,
): Promise<PullRequest> {
  const { data: pullRequest } = await octokit.pulls.get({
    owner,
    repo,
    pull_number: number,
  });
  return pullRequest;
}

export type MergeableState = 'clean' | 'unstable';

interface MergeOptions {
  mergeableStates?: MergeableState[];
}

export async function mergePullRequest(
  owner: string,
  repo: string,
  number: number,
  { mergeableStates = ['clean'] }: MergeOptions = {},
) {
  const pullRequest = await getPullRequest(owner, repo, number);

  if (
    !pullRequest.mergeable ||
    !mergeableStates.includes(pullRequest.mergeable_state as MergeableState)
  ) {
    console.log(
      chalk.gray(
        `⏩ Will pass for ${pullRequest.html_url}, (state: ${chalk.yellow(
          pullRequest.mergeable_state,
        )})`,
      ),
    );
    return;
  }

  const mergeSpinner = ora(
    `Will try to merge ${owner}/${repo}/${number}`,
  ).start();
  try {
    await octokit.pulls.merge({
      owner,
      repo,
      pull_number: number,
    });
    mergeSpinner.succeed(
      `Merge success (${owner}/${repo}/${number}) - ${pullRequest.mergeable_state}`,
    );
  } catch (err) {
    mergeSpinner.fail(
      `Fail to merge ${owner}/${repo}/${number} => ${err.message}`,
    );
  }
}

export async function getOpenedPullRequests(): Promise<IssueSearchResultItems> {
  const organisationNames = getUserOrganisationNames();
  if (!organisationNames.length) return [];

  const organisationFilter = organisationNames
    .map((name) => `user:${name}`)
    .join(' ');
  const {
    data: { items },
  } = await octokit.search.issuesAndPullRequests({
    q: `is:open is:pr archived:false ${organisationFilter}`,
    per_page: DEFAULT_PER_PAGE,
  });
  return items;
}

export async function mergeMergeablePullRequests(
  options?: MergeOptions,
): Promise<void> {
  const pullRequests = await getOpenedPullRequests();
  if (!pullRequests.length) {
    console.log(chalk.yellow('🔀 No PR found'));
    return;
  }

  for (const pullRequest of pullRequests) {
    const [number, , repo, owner] = pullRequest.html_url.split('/').reverse();
    const pullNumber = parseInt(number, 10);
    await mergePullRequest(owner, repo, pullNumber, options);
  }
}
