import inquirer from 'inquirer';

import preferencesStore, { Preferences } from '../../helper/preferencesStore';
import {
  nonOrganisationQuestions,
  organisationsQuestions,
  resetOrganisationsQuestions,
} from './prompts';

async function collectOrganisations(): Promise<string[]> {
  let organisations: string[] = preferencesStore.get('organisations');
  const { resetOrganisations, addOrganisations } = await inquirer.prompt(
    resetOrganisationsQuestions(organisations),
  );
  if (resetOrganisations) {
    preferencesStore.set('organisations', []);
    organisations = [];
  }
  if (!addOrganisations) return organisations;

  let addMoreOrganisation = true;
  while (addMoreOrganisation) {
    const organisationAnswers = await inquirer.prompt(
      organisationsQuestions(organisations),
    );
    addMoreOrganisation = organisationAnswers.addMoreOrganisation;
    organisations.push(organisationAnswers.organisation);
  }

  return organisations;
}

export default async function handler(): Promise<void> {
  const preferencesAnswers: Preferences = {
    ...(await inquirer.prompt(nonOrganisationQuestions)),
    organisations: await collectOrganisations(),
  };

  (Object.keys(preferencesAnswers) as (keyof Preferences)[]).forEach(
    (answerKey) =>
      preferencesStore.set(answerKey, preferencesAnswers[answerKey]),
  );
}
