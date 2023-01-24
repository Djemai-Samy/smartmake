import chalk from "chalk";
import { isValidLanguage, lang } from "../../../translate.js";
import { askApps, askDocker, askLanguage, askTask, list } from "../../../utils/ask.js";
import { checkCommand, spawnCommand } from "../../../utils/commands.js";
import {
	dockerComposeDevFileExist,
	dockerComposeFileExist,
	packageFileExist,
} from "../../../utils/filesystem.js";
import { error, log } from "../../../utils/log.js";
import { ManagerFlags } from "../cli.js";
import header from "../../../utils/init.js";
import Ora from "ora";
import { getManager } from "./apps/ManagerFactory.js";
/**
 * smartmaje start
 * Start quickly et easily your services in one process.
 *
 * @author Djemai Samy <djemai-samy>
 */
export default class ProjectManager {
	settings: Settings;
	options: { flags: ManagerFlags; inputs: string[] };

	language: string = "en";
	packageManager: string;
	task: string = "dev";
	useDocker: boolean = false;

	services: Record<string, Service> = {};

	color: string = "#4AABEE";
	constructor(settings: Settings, options: { flags: ManagerFlags; inputs: string[] }) {
		this.settings = settings;
		this.packageManager = this.settings.useYarn ? "yarn" : "npm";
		this.options = options;
	}

	async run() {
		await this.prompting();

		if (this.useDocker) {
			await this.launchCompose();
			return;
		}

		await this.launchServices();
	}

	private async prompting() {
		this.language = await this._getLanguage();

		const text = await lang.getInstance(this.language);

		this.task = await this._getTask();

		this.useDocker = await this._getUseDocker();

		if (this.useDocker) return;

		this.services = await this._getServices();
	}

	private async launchCompose() {
		const text = await lang.getInstance();
		if (!packageFileExist()) {
			error(text.t("start.common.error.noPackageFile"));
			return;
		}

		if (this.task === "dev") {
			if (!dockerComposeDevFileExist()) {
				error(text.t("start.common.noDockerDevFile"));
				return;
			}

			await this._launchComposeDev("dev");
		}

		if (this.task === "build" || this.task === "prod") {
			if (!dockerComposeFileExist()) {
				error(text.t("start.common.noDockerFile"));
				return;
			}

			await this._launchComposeDev(this.task === "build" ? "build" : "up");
		}
	}

	private async launchServices() {

    const managers = Object.keys(this.services).map((serviceName) => {
			const Manager = getManager(serviceName);
			const managerInstance = new Manager(
				this.services[serviceName],
				this.task,
				this.settings,
        this.services
			);
			return managerInstance;
		});

    for (const manager of managers) {
      await manager.prompt();
    }

		const promises = managers.map(async (managerInstance) => {
			return await managerInstance.run();
		});

		Promise.all(promises)
			.then(() => {
			})
			.catch((err) => {
				// Handle error
			});
	}

	//Questions
	private async _getLanguage() {
		//Priority to flags incommand first
		if (this.options.flags.language && isValidLanguage(this.options.flags.language)) {
			return this.options.flags.language;
		}

		//Then in the settings file (Most cases)
		if (this.settings.language && isValidLanguage(this.settings.language)) {
			return this.settings.language;
		}

		//Default to english if no language in flags or settings and --yes flag provided
		if (this.options.flags.yes) {
			return;
		}

		//Ask for the language
		return await askLanguage();
	}

	private async _getTask() {
		if (this.options.inputs.includes("dev")) {
			return "dev";
		}
		if (this.options.inputs.includes("build")) {
			return "build";
		}
		if (this.options.inputs.includes("prod")) {
			return "prod";
		}

		return await askTask();
	}

	private async _getUseDocker() {
		//return false if useDocker in the settings is set to false
		if (!this.settings.useDocker) return false;

		// return false is the commands docker and docker-compose doesnt not exist
		const dockerExist = await checkCommand("docker");
		const dockerComposeExist = await checkCommand("docker-compose");
		if (!dockerExist && !dockerComposeExist) return false;

		//Check if the flag --noDocker was provided
		if (this.options.flags.noDocker) return false;

		//Check if the flag --docker was provided
		if (this.options.flags.docker) return true;

		//Check if the flag --yes is provided and return the default true
		if (this.options.flags.yes) return true;

		//Asking
		return await askDocker();
	}

	private async _getServices() {
		if (this.options.flags.all || this.options.flags.yes) return this.settings.services;

		const services = Object.values(this.settings.services).map((service) => {
			return {
				name: chalk.hex(service.color).bold(`${service.appName} on port ${service.port}`),
				value: service.appName,
				checked: false,
			};
		});

		let chosenServices = await askApps(services);

		//['server','front'] => {"express":{appName:"server", ...}, "react":{appName:'front', ...}}
		return Object.entries(this.settings.services)
			.filter(([key, value]) => chosenServices.includes(value.appName))
			.reduce((filteredServices, [key, value]) => {
				filteredServices[key] = value;
				return filteredServices;
			}, {} as any);
	}

	//Processes
	private async _launchComposeDev(composeCommand: string) {
		const spinner = Ora("");
		spinner.start();
		spawnCommand(process.cwd(), `${this.packageManager} run compose:${composeCommand}`, {
			stdout: (arr) => {
				this._logCompose(arr, spinner);
			},

			stderr: (arr) => {
				this._logCompose(arr, spinner);
			},
			exit: (code, arr) => {
				spinner.clear();
				header({
					title: `[${this.settings.name}]:`,
					tagLine: `Stopping...`,
					description: "",
					version: "",
					bgColor: this.color,
					color: "#000000",
					bold: true,
					clear: false,
				});
			},
			close: (code, arr) => {
				spinner.clear();
				header({
					title: `[${this.settings.name}]:`,
					tagLine: `Closed!`,
					description: "",
					version: "",
					bgColor: this.color,
					color: "#000000",
					bold: true,
					clear: false,
				});
			},
			error: (err) => {
				log(err);
			},
		});
	}

	//Logs helpers
	protected _logCompose(arr: string[], spinner: { clear: () => void; text: string }) {
		spinner.clear();

		//Log dedicated container: <projetName>-<appName> | log...
		if (arr.join("\n").includes("|")) {
			//Adding some timestamp to the log
			const date = new Date();
			const dateFormat = `${date.toLocaleString()}`;

			//Get name of container
			const container = arr[0].split("|")[0];

			//get arrays of logs
			const lines = arr.map((el: string) => el.split("|")[1]);

			//Get  generator from the appName
			const service = Object.keys(this.settings.services).filter((s) => {
				return container.includes(this.settings.services[s].appName);
			})[0];

			//Show the logs
			header({
				title: `${container.trim()}`,
				tagLine: `[${dateFormat}]`,
				description: lines,
				version: "",
				bgColor: service ? this.settings.services[service].color : "#4AABEE",
				color: "#000000",
				bold: true,
				clear: false,
			});

			//Show stop command in the spinner
			spinner.text = `${chalk.green("Waiting...")} 'CTRL + C' to ${chalk.red("stop!")}`;
		} else {
			//This is usually building phase

			//will log each line and try to add colors
			arr.forEach((line: string) => {
				//Get the service if it can: # [<projetName>-<appName>-dev]
				const serviceColor = Object.keys(this.settings.services).filter((service) => {
					return line.includes(this.settings.services[service].appName);
				});

				//which color, service or default
				const lineColor =
					serviceColor.length && serviceColor.length >= 1
						? this.settings.services[serviceColor[0]].color
						: "#ffffff";
				log(
					`${chalk.magenta.bold(`${this.settings.name}`)}: ${chalk
						.hex(lineColor)
						.bold(line)}`
				);
				spinner.text = arr ? chalk.hex(lineColor).bold(arr[arr.length - 1]) : "...";
			});
		}
	}
}

export type Settings = {
	name: string;
	language: string;
	useTypescript: boolean;
	useDocker: boolean;
	useYarn: boolean;
	services: Record<string, Service>;
};

export type Service = {
	appName: string;
	port: string;
	color: string;
};
//
