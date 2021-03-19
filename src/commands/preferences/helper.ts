import chalk from 'chalk';

// eslint-disable-next-line import/prefer-default-export
export function organisationsSuffix(organisations: string[]) {
  return organisations.length > 0
    ? ` (${chalk.yellow(organisations.join(', '))})`
    : '';
}
