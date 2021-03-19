import yoCommand from '../../commands/yo';
import { displayOutput, runCommand } from '../helper';

describe('commands/yo', () => {
  it('should display help', async () => {
    const output = await displayOutput(yoCommand, '--help');

    expect(output).toMatchInlineSnapshot(`
      "test [command]

      Commands:
        test yo <name> [color]  Say yo                                [aliases: hello]

      Options:
        --help     Show help                                                 [boolean]
        --version  Show version number                                       [boolean]"
    `);
  });

  it('should say yo', async () => {
    const logSpy = jest.spyOn(console, 'log');
    await runCommand(yoCommand, 'yo John red');

    expect(logSpy.mock.calls).toMatchInlineSnapshot(`
      Array [
        Array [
          "🤘 John",
        ],
      ]
    `);
  });
});
