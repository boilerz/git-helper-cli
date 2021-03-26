#!/usr/bin/env node

import readPkgUp from 'read-pkg-up';
import updateNotifier from 'update-notifier';
import { Argv } from 'yargs';
// @ts-ignore not typed yet
import { hideBin } from 'yargs/helpers';
import yargs from 'yargs/yargs';

import mergeCommand, { MergeArguments } from './commands/merge';
import preferencesCommand from './commands/preferences';

export default function run(args: string[]): void {
  updateNotifier({
    pkg: readPkgUp.sync({ cwd: __dirname })?.packageJson,
  }).notify();
  const argv = yargs(args);

  argv.scriptName('git-helper');
  argv.command(preferencesCommand);
  (argv as Argv<MergeArguments>).command(mergeCommand);

  argv.demandCommand().detectLocale(false).help().parse();
}

/* istanbul ignore if */
if (!module.parent) run(hideBin(process.argv));
