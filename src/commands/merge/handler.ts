import * as githubHelper from '../../helper/github';
import { MergeableState } from '../../helper/github';

export interface MergeArguments {
  states: MergeableState[];
}

export default async function handler({
  states,
}: MergeArguments): Promise<void> {
  if (!githubHelper.setup()) return;

  await githubHelper.mergeMergeablePullRequests({ mergeableStates: states });
}
