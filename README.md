# @boilerz/boilerplate-cli

[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/boilerz/boilerplate-cli/blob/master/LICENSE)
[![GH CI Action](https://github.com/boilerz/boilerplate-cli/workflows/CI/badge.svg)](https://github.com/boilerz/boilerplate-cli/actions?query=workflow:CI)
[![codecov](https://codecov.io/gh/boilerz/boilerplate-cli/branch/master/graph/badge.svg)](https://codecov.io/gh/boilerz/boilerplate-cli)

> Boilerplate lib.

### Setup

1. Use as template, then after pulling the repo:

```bash
yarn install
yarn custom
```

2. Add `CODECOV_TOKEN` as a secret.

3. Update `my-command` name on [package.json](./package.json) and on [src/cli.ts](./src/cli.ts):

```json
{
  "bin": {
    "my-command": "cli.js"
  }
}
```

```typescript
  argv.scriptName('my-command');
```
