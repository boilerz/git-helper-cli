import Conf from 'conf';

export interface Preferences {
  githubTokenEnvVar: string;
  organisations: string[];
}

const preferencesStore = new Conf<Preferences>({
  defaults: {
    githubTokenEnvVar: 'GITHUB_TOKEN',
    organisations: [],
  },
});

export default preferencesStore;
