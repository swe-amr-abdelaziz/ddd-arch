import { run } from './presentation/cli';

process.exitCode = run(process.argv, {
  cwd: process.cwd(),
  out: (line) => {
    console.log(line);
  },
  err: (line) => {
    console.error(line);
  },
});
