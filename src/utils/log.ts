import chalk from "chalk";
import alert from "cli-alerts"
export const log =  (info: any) => {
	// alert({
	// 	type: `warning`,
	// 	name: `DEBUG LOG`,
	// 	msg: ``
	// });
  console.log();
	console.log(info);
};

export const info = (info: string) => {
  
  log(`${chalk.blue.bold.underline("info")}: ${info}`)
}

export const error = (error: string) => {
  log(`${chalk.red.bold.underline("error")}: ${error}`)
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

