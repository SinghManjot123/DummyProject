import { execSync } from 'child_process';

export async function startFeatureBranch(title: string) {
  const branchName = `feature/${title.toLowerCase().replace(/\s+/g, '-')}`;

  execSync('git fetch origin');
  execSync('git checkout main');
  execSync('git pull origin main');
  execSync(`git checkout -b ${branchName}`);

  return {
    branchName,
  };
}
