import chalk from 'chalk';
import { QuestionCollection } from 'inquirer';
import { IterableElement } from 'type-fest';

import * as githubHelper from '../../helper/github';
import preferencesStore, { Preferences } from '../../helper/preferencesStore';
import { organisationsSuffix } from './helper';

export const nonOrganisationQuestions: QuestionCollection<
  Omit<Preferences, 'organisations'>
> = [
  {
    name: 'githubTokenEnvVar',
    message: 'Choose github token env var',
    type: 'input',
    default: preferencesStore.get('githubTokenEnvVar'),
  },
];

export interface ResetOrganisationAnswers {
  resetOrganisations: boolean;
  addOrganisations: boolean;
}

export function resetOrganisationsQuestions(
  organisations: string[],
): QuestionCollection<ResetOrganisationAnswers> {
  return [
    {
      name: 'resetOrganisations',
      message: 'Do you want to reset your github organisations list?',
      suffix: organisationsSuffix(organisations),
      type: 'confirm',
      when: organisations.length > 0,
      default: false,
    },
    {
      name: 'addOrganisations',
      message: 'Do you want to add github organisations?',
      type: 'confirm',
      default: organisations.length === 0,
    },
  ];
}

export interface OrganisationsAnswers {
  organisation: IterableElement<Preferences['organisations']>;
  addMoreOrganisation: boolean;
}

export function organisationsQuestions(
  organisations: string[],
): QuestionCollection<OrganisationsAnswers> {
  return [
    {
      name: 'organisation',
      message: 'Add a github organisation',
      suffix: organisationsSuffix(organisations),
      async validate(organisation: string): Promise<boolean | string> {
        if (!organisation) {
          return chalk.red('Organisation must not be empty');
        }
        if (organisations.includes(organisation)) {
          return chalk.yellow('This organisation is already in your list');
        }
        if (!(await githubHelper.checkOrganisationExistence(organisation))) {
          return chalk.red('This organisation does not exists');
        }
        return true;
      },
      type: 'input',
    },
    {
      name: 'addMoreOrganisation',
      message: 'Add an other organisation?',
      type: 'confirm',
    },
  ];
}
