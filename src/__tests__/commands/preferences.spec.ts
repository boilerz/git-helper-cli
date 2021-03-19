import inquirer from 'inquirer';
import { mocked } from 'ts-jest/utils';

import preferencesCommand from '../../commands/preferences';
import preferencesStore from '../../helper/preferencesStore';
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
    mockedInquirer.prompt.mockResolvedValue({
      foo: 'foo',
      bar: false,
      baz: 8,
    });

    await runCommand(preferencesCommand, 'p');

    expect(inquirer.prompt).toMatchSnapshot();
    expect(preferencesStore.get('foo')).toEqual('foo');
    expect(preferencesStore.get('bar')).toBe(false);
    expect(preferencesStore.get('baz')).toEqual(8);
  });
});
