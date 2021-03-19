import Conf from 'conf';

export interface Preferences {
  foo: string;
  bar: boolean;
  baz: number;
}

const preferencesStore = new Conf<Preferences>({
  defaults: {
    foo: 'foo',
    bar: true,
    baz: 42,
  },
});

export default preferencesStore;
