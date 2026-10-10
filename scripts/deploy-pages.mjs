import { spawnSync } from 'node:child_process';
import { mkdtempSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
function run(command, args, options = {}) {
  const result = spawnSync(command, args, { cwd: root, encoding: 'utf8', ...options });
  if (result.error) throw result.error;
  if (result.status !== 0) throw new Error(`${command} failed (${result.status}): ${result.stderr || ''}`);
  return result.stdout?.trim() || '';
}
const source = run('git', ['rev-parse', '--verify', 'HEAD']);
run('npm', ['run', 'build'], { stdio: 'inherit' });
writeFileSync(join(root, 'dist', '.nojekyll'), '');
const gitDir = resolve(root, run('git', ['rev-parse', '--git-dir']));
const temp = mkdtempSync(join(tmpdir(), 'healthy-bhaiya-pages-'));
try {
  // A separate temporary index keeps the source checkout and its staged files untouched.
  const options = { cwd: join(root, 'dist'), env: { ...process.env, GIT_INDEX_FILE: join(temp, 'index') } };
  const gitOptions = [`--git-dir=${gitDir}`, `--work-tree=${join(root, 'dist')}`];
  run('git', [...gitOptions, 'read-tree', '--empty'], options);
  run('git', [...gitOptions, 'add', '--all', '--', '.'], options);
  const tree = run('git', [...gitOptions, 'write-tree'], options);
  const existing = run('git', ['ls-remote', '--heads', 'origin', 'refs/heads/gh-pages']);
  const parent = existing ? existing.split(/\s/)[0] : null;
  if (parent) run('git', ['fetch', 'origin', 'refs/heads/gh-pages'], { stdio: 'inherit' });
  const commit = run('git', ['commit-tree', tree, ...(parent ? ['-p', parent] : []), '-m', `Deploy Healthy Bhaiya Anna from ${source.slice(0, 12)}`]);
  // A normal push rejects concurrent updates rather than overwriting remote work.
  run('git', ['push', 'origin', `${commit}:refs/heads/gh-pages`], { stdio: 'inherit' });
  console.log('Uploaded the static site to gh-pages. GitHub Pages must use this branch and the / (root) folder.');
} finally {
  rmSync(temp, { recursive: true, force: true });
}
