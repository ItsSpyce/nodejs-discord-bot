import chalk from 'chalk';

export function log(data?: any) {
  console.log(chalk`{bgBlueBright.black INFO} ${data}`);
}

export function success(data?: any) {
  console.log(chalk`{bgGreenBright.black SUCCESS} ${data}`);
}

export function warn(data?: any) {
  console.log(chalk`{bgYellowBright.black WARN} ${data}`);
}

export function error(data?: any) {
  console.log(chalk`{bgRedBright.black ERROR} ${data}`);
}

export function debug(data?: any) {
  if (process.env.NODE_ENV === 'development') {
    console.log(chalk`{bgMagentaBright.black DEBUG} ${data}`);
  }
}

export default {
  log,
  success,
  warn,
  error,
  debug,
};
