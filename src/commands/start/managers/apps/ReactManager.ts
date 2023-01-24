import chalk from "chalk";
import ora from "ora";
import { lang } from "../../../../translate.js";
import { proceed } from "../../../../utils/ask.js";
import { spawnCommand } from "../../../../utils/commands.js";
import { error, log, logService } from "../../../../utils/log.js";
import { Service, Settings } from "../ProjectManage.js";
import BaseManager from "./BaseManager.js";

export default class ExpressManager extends BaseManager {
	constructor(
		service: Service,
		task: string,
		settings: Settings,
		services: Record<string, Service>
	) {
		super(service, task, settings, services);
	}

	async prompt() {
		if (!(this.task === "prod")) {
			return;
		}

		const text = await lang.getInstance();
		//When using docker, the app is served with nginx
		if (this.settings.useDocker) {
			logService({
				title: `[${this.service.appName}]`,
				description: [
					` ${chalk.hex("#F18E16").bold("[WARNING]")}: ${text.t(
						"start.react.warning.nginx"
					)}`,
				],
				bgColor: this.service.color,
			});
			//Ask if he want to continue
			const isProceeding = await proceed(false);
			if (!isProceeding) {
				process.exit(0);
			}
			return;
		}
		//If not using docker, the app is served with express
		if (Object.keys(this.services).includes("express")) {
			logService({
				title: `[${this.service.appName}]`,
				description: [
					` ${chalk.blueBright.bold("[INFO]")}: ${text.t("start.react.info.express")}`,
				],
				bgColor: this.service.color,
			});

			//Ask if he want to continue
			if (!(await proceed(true))) {
				process.exit(0);
			}
			await this.runBuildSync();
			return;
		}

		//No service to serve the app
		error(text.t("start.react.error.server"));
		logService({
			title: `[${this.service.appName}]`,
			description: [
				` ${chalk.red.bold("[ERROR]")}: ${text.t("start.react.error.server")}`,
			],
			bgColor: this.service.color,
		});

		//If it the only service or he choose to stop
		if (Object.keys(this.services).length === 1 || !(await proceed(true))) {
			process.exit(0);
		}
	}

	async run() {
		if (this.task === "dev") {
			await this.runDev();
		}

		if (this.task === "build") {
			this.runBuild();
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
	}
	private async runBuildSync() {
		const spinner = ora("");
		spinner.start();
		const text = await lang.getInstance();
		await new Promise<void>((resolve, reject) => {
			spawnCommand(
				`${process.cwd()}/${this.service.appName}`,
				`${this.packageManager} run build`,
				{
					stdout: (arr) => {
						spinner.clear();
						spinner.text = `${chalk
							.hex(this.service.color)
							.bold(this.service.appName)}: ${arr.join("\n")}`;
					},
					stderr: (arr) => {
						spinner.clear();
						spinner.text = `${chalk
							.hex(this.service.color)
							.bold(this.service.appName)}: ${arr.join("\n")}`;
					},
					exit: (code, arr) => {
						spinner.clear();
					},
					close: (code, arr) => {
						log(
							chalk
								.hex(this.service.color)
								.bold(`${text.t("start.react.info.builded")}`)
						);
						spinner.clear();
						spinner.stop();
						resolve();
					},
					error: (err) => {
						log(`Error for ${this.service.appName}: ${err}`);
					},
				},
				false
			);
		});
	}
}
