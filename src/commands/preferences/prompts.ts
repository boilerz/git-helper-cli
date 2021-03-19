import { QuestionCollection } from 'inquirer';

import preferencesStore, { Preferences } from '../../helper/preferencesStore';

export const questions: QuestionCollection<Preferences> = [
  {
    name: 'foo',
    message: 'Choose foo',
    type: 'input',
    default: preferencesStore.get('foo'),
  },
  {
    name: 'bar',
    message: 'Enable bar',
    type: 'confirm',
    default: preferencesStore.get('bar'),
  },
  {
    name: 'baz',
    message: 'Choose baz',
    type: 'number',
    default: preferencesStore.get('baz'),
  },
];

export const initialAnswers: Partial<Preferences> = {};
