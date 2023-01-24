import ora from "ora";
import { spawnCommand } from "../../../../utils/commands.js";
import { Service, Settings } from "../ProjectManage.js";
import BaseManager from "./BaseManager.js";
import { log, logService } from "../../../../utils/log.js";
import chalk from "chalk";

export default class ExpressManager extends BaseManager {
	constructor(service: Service, task: string, settings: Settings, services: Record<string, Service>) {
		super(service, task, settings, services);
	}
  async prompt(){
  }
  
	async run() {
		if (this.task === "dev") {
			await this.runDev();
		}

		if (this.task === "build") {
			if (this.settings.useTypescript) {
				this.runBuild();
			}
		}

		if (this.task === "prod") {
      await this.runProd();
		}
	}

	private async runDev() {
		const spinner = ora("");
		spinner.start();
		spawnCommand(
			`${process.cwd()}/${this.service.appName}`,
			`${this.packageManager} run dev`,
			{
				stdout: (arr) => {
					spinner.clear();
					logService({
						title: `[${this.service.appName}]:${this.service.port}`,
						description: arr,
						bgColor: this.service.color,
					});

					//Show stop command in the spinner
					spinner.text = `${chalk.green("Waiting...")} 'CTRL + C' to ${chalk.red(
						"stop!"
					)}`;
				},

				stderr: (arr) => {
					spinner.clear();
					logService({
						title: `[${this.service.appName}]:${this.service.port}`,
						description: arr,
						bgColor: this.service.color,
					});
					//Show stop command in the spinner
					spinner.text = `${chalk.green("Waiting...")} 'CTRL + C' to ${chalk.red(
						"stop!"
					)}`;
				},
				exit: (code, arr) => {
					spinner.clear();
					logService({
						title: `[${this.service.appName}]:${this.service.port}`,
						description: [`Stopping...`],
						bgColor: this.service.color,
					});
				},
				close: (code, arr) => {
					spinner.clear();
					logService({
						title: `[${this.service.appName}]:${this.service.port}`,
						description: [`Stopped.`],
						bgColor: this.service.color,
					});
				},
				error: (err) => {
					log(err);
				},
			}
		);
	}
	private async runBuild() {
		const spinner = ora("");
		spinner.start();
		spawnCommand(
			`${process.cwd()}/${this.service.appName}`,
			`${this.packageManager} run build`,
			{
				stdout: (arr) => {
					spinner.clear();
					logService({
						title: `[${this.service.appName}]`,
						description: arr,
						bgColor: this.service.color,
					});

					spinner.text = `${chalk.green("Building...")}`;
				},

				stderr: (arr) => {
					spinner.clear();
					logService({
						title: `[${this.service.appName}]`,
						description: arr,
						bgColor: this.service.color,
					});

					spinner.text = `${chalk.green("Building...")}`;
				},
				exit: (code, arr) => {},
				close: (code, arr) => {
					spinner.clear();
					logService({
						title: `[${this.service.appName}]`,
						description: [`Build complete.`],
						bgColor: this.service.color,
					});
				},
				error: (err) => {
					log(err);
				},
			}
		);
	}
	private async runProd() {
    const spinner = ora("");
		spinner.start();
		spawnCommand(
			`${process.cwd()}/${this.service.appName}`,
			`${this.packageManager} run start`,
			{
				stdout: (arr) => {
					spinner.clear();
					logService({
						title: `[${this.service.appName}]:${this.service.port}`,
						description: arr,
						bgColor: this.service.color,
					});

					//Show stop command in the spinner
					spinner.text = `${chalk.green("Waiting...")} 'CTRL + C' to ${chalk.red(
						"stop!"
					)}`;
				},

				stderr: (arr) => {
					spinner.clear();
					logService({
						title: `[${this.service.appName}]:${this.service.port}`,
						description: arr,
						bgColor: this.service.color,
					});
					//Show stop command in the spinner
					spinner.text = `${chalk.green("Waiting...")} 'CTRL + C' to ${chalk.red(
						"stop!"
					)}`;
				},
				exit: (code, arr) => {
					spinner.clear();
					logService({
						title: `[${this.service.appName}]:${this.service.port}`,
						description: [`Stopping...`],
						bgColor: this.service.color,
					});
				},
				close: (code, arr) => {
					spinner.clear();
					logService({
						title: `[${this.service.appName}]:${this.service.port}`,
						description: [`Stopped.`],
						bgColor: this.service.color,
					});
				},
				error: (err) => {
					log(err);
				},
			}
		);
  }
}
