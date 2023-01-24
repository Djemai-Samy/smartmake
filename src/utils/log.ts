import chalk from "chalk";
import alert from "cli-alerts"
const dim = chalk.dim;
export const log =  (info: any) => {
	console.log(info);
  console.log();
};

export const info = (info: string) => {
  
  log(`${chalk.blue.bold.underline("info")}: ${info}`)
}

export const error = (error: string) => {
  log(`${chalk.red.bold.underline("error")}: ${error}`)
}

export const warning = (warning: string) => {
  log(`${chalk.hex('#F18E16').bold.underline("warning")}: ${warning}`)
}

export const magic = (type: string, message: string) => {
  log(`${chalk.magenta.bold.underline(type)}: ${message}`)
}

export const success = ( message: string) => {
  log(`${chalk.green.bold.underline("success")}: ${message}`)
}

export const sep = () =>{
  log(`${chalk.bgBlack.underline('                                   ')}`)
}


export const logService = (options: any) => {

  //Adding some timestamp to the log
  const date = new Date();
  const dateFormat = `${date.toLocaleString()}`;

  const {
    title,
    description,
    bgColor,
  } = options;

  console.log(
    `${`${chalk.bgHex(bgColor).hex("#00000").bold(` ${title} `)}`} ${dim(dateFormat)}\n\n${
      
          description.length ? description?.join('\n\n'): description
    
    }`
  );
  console.log(`${chalk.bgBlack.hex(bgColor).underline('                                    ')}`)
  console.log();
};

//

