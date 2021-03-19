import updateNotifier from 'update-notifier';

import pkg from '../../package.json';
import run from '../cli';

describe('cli', () => {
  beforeEach(() => {
    jest.spyOn(process, 'exit').mockImplementation();
  });

  it('should setup cli', () => {
    const errorSpy = jest.spyOn(console, 'error');

    run([]);

    expect(errorSpy.mock.calls).toMatchSnapshot();
  });

  it('should call the update notifier', () => {
    run([]);

    expect(updateNotifier).toHaveBeenCalled();
    expect(updateNotifier({ pkg }).notify).toHaveBeenCalled();
  });
});
