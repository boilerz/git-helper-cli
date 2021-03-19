import inquirer from 'inquirer';

import preferencesStore, { Preferences } from '../../helper/preferencesStore';
import { initialAnswers, questions } from './prompts';

export default async function handler(): Promise<void> {
  const answers: Preferences = await inquirer.prompt(questions, initialAnswers);
  (Object.keys(answers) as (keyof Preferences)[]).forEach((answerKey) =>
    preferencesStore.set(answerKey, answers[answerKey]),
  );
}
