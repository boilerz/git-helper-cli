import chalk from 'chalk';
import execa from 'execa';
import { Arguments } from 'yargs';

export type Color = 'blue' | 'red' | 'yellow';

export interface YoArguments {
  name: string;
  color: string;
}

export default async function handler({
  name,
  color,
}: Arguments<YoArguments>): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  const { stdout } = await execa('echo', [name]);
  console.log(`🤘 ${chalk[color as Color](stdout)}`);
}
