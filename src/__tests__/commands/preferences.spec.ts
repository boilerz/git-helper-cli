import inquirer from 'inquirer';
import { mocked } from 'ts-jest/utils';

import preferencesCommand from '../../commands/preferences';
import {
  OrganisationsAnswers,
  ResetOrganisationAnswers,
} from '../../commands/preferences/prompts';
import * as githubHelper from '../../helper/github';
import preferencesStore, { Preferences } from '../../helper/preferencesStore';
import { displayOutput, runCommand } from '../helper';

const mockedInquirer = mocked(inquirer, true);

describe('commands/preferences', () => {
  it('should display help', async () => {
    const output = await displayOutput(preferencesCommand, '--help');

    expect(output).toMatchInlineSnapshot(`
      "test [command]

      Commands:
        test preferences  Set preferences                                 [aliases: p]

      Options:
        --help     Show help                                                 [boolean]
        --version  Show version number                                       [boolean]"
    `);
  });

  it('should prompt and store preferences', async () => {
    jest
      .spyOn(githubHelper, 'checkOrganisationExistence')
      .mockResolvedValue(true);

    mockedInquirer.prompt
      .mockResolvedValueOnce({
        githubTokenEnvVar: 'MY_CUSTOM_TOKEN_ENV_VAR',
      } as Partial<Preferences>)
      .mockResolvedValueOnce({
        resetOrganisations: false,
        addOrganisations: true,
      } as ResetOrganisationAnswers)
      .mockResolvedValueOnce({
        organisation: 'boilerz',
        addMoreOrganisation: true,
      } as OrganisationsAnswers)
      .mockResolvedValueOnce({
        organisation: 'howm',
        addMoreOrganisation: false,
      } as OrganisationsAnswers);

    await runCommand(preferencesCommand, 'p');

    expect(inquirer.prompt).toMatchSnapshot();
    expect(preferencesStore.get('organisations')).toEqual(['boilerz', 'howm']);
    expect(preferencesStore.get('githubTokenEnvVar')).toEqual(
      'MY_CUSTOM_TOKEN_ENV_VAR',
    );
  });
});
