import { readPackageVersion } from './infrastructure/package-version';
import { run } from './presentation/cli';

process.exitCode = run(process.argv, {
  cwd: process.cwd(),
  version: readPackageVersion(new URL('../package.json', import.meta.url)),
  out: (line) => {
    console.log(line);
  },
  err: (line) => {
    console.error(line);
  },
});
