jest.mock('inquirer');
jest.mock('update-notifier', () =>
  jest.fn().mockReturnValue({
    notify: jest.fn()
  })
);
jest.mock('conf', () => {
  let store: Map<string, unknown> = new Map();

  return ({
    __esModule: true,
    default: jest.fn().mockImplementation(({ defaults }) => {
      Object.keys(defaults!).forEach(key => {
        store.set(key, defaults[key]);
      });
      return store;
    }),
    set: jest.fn().mockImplementation(store.set),
    get: jest.fn().mockImplementation(store.get)
  });
  }
);
