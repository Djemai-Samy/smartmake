import Generator from "yeoman-generator";
import { isValidLanguage, lang} from "../../translate.js";
import { ask,confirm, checkbox, askLanguage } from "../../utils/ask.js";
import { checkCommand } from "../../utils/commands.js";
import { error, log, magic } from "../../utils/log.js";
import BaseGenerator from "../BaseGenerator.js";
import fs from "fs";
import fse from "fs-extra";
import path from "path";
import { info } from "console";
import chalk from "chalk";
import { getGenerator } from "./AppFactory.js";
import { Services} from "./ServicesTracker.js";
import { testAppName } from "../../utils/validation.js";
import header from "../../utils/init.js";
import ora from "ora";
export default class ProjectGenerator extends BaseGenerator {
	generators: { name: string; generator: Generator }[] = [];

	// The name `constructor` is important here
	constructor(args: string | string[], opts: Generator.GeneratorOptions) {
		// Calling the super constructor is important so our generator is correctly set up

		super(args, opts, "base");
		this.color = "#4AABEE";
	}

	async prompting() {
		await this._parseOptions();

		this.language= await this._askLanguage();

		const text = await lang.getInstance(this.language);

		await this._askProjetName(text);

		await this._askAppsList(text);

		await this._askOptions(text);

		this._resumeOptions(text);

		this._loadAppGenerators();
	}
	async writing() {
		fse.mkdir(`${this.projectName}`);
		const text = await lang.getInstance(this.language);

		if (this.options.useDocker) {
			this.fs.copyTpl(`${this.templateFolderPath}/**/*`, this._getProjectPath(), {
				projectName: this.projectName,
				text: text,
				packageManager: this.options.useYarn ? "yarn" : "npm",
				useTypescript: this.options.useTypescript,
				services: this.services.getServices(),
			});
		}

		this.fs.copyTpl(
			`${this.templateFolderPath}/package.json`,
			`${this._getProjectPath()}/package.json`,
			{
				projectName: this.projectName,
				text: text,
				packageManager: this.options.useYarn ? "yarn" : "npm",
				useTypescript: this.options.useTypescript,
				useDocker: this.options.useDocker,
				services: this.services.getServices(),
			},
			{},
			{}
		);
	}

	async install() {}

	async end() {
		const text = await lang.getInstance(this.language);

		if (this.options.useDocker) {
			header({
				title: `Docker Compose`,
				tagLine: `cd ${this.projectName}`,
				description: [
					`${chalk.magenta(` ${this.packageManager} run compose:dev`)} : ${text.t(
						"compose.commands.dev"
					)}`,
					`${chalk.magenta(` ${this.packageManager} run compose:up`)} : ${text.t(
						"compose.commands.up"
					)}`,
				],
				version: "",
				bgColor: this.color,
				color: "#000000",
				bold: true,
				clear: false,
			});
		}

		//Creating a json file with the services, names...
		//This is for starting the services with the cli

		const jsonSettings = JSON.stringify(
			{
				name: this.projectName,
				language: this.language,
				useTypescript: this.options.useTypescript,
				useDocker: this.options.useDocker,
				useYarn: this.options.useYarn,
				services: this.services.getServices(),
			},
			null,
			2
		);
		// Write JSON string to a file
		fs.writeFileSync(`${this._getProjectPath()}/smartmake.json`, jsonSettings);

		if (!this.options.install) {
			return;
		}

		const start = await confirm(text.t("common.ask.startServer"), true);

		if (start) {
			this.generators.forEach((gen) => (gen.generator.options.start = true));

			if (this.options.useDocker) {
				const spinner = ora("Stating server...");

				spinner.start();

				await new Promise<void>((resolve, reject) => {
					this._spawnCommandProject(`${this.packageManager} run compose:dev`, {
						stdout: (arr) => {
							this._logCompose(arr, spinner);
						},

						stderr: (arr) => {
							this._logCompose(arr, spinner);
						},
						exit: (code, arr) => {
							spinner.clear();
							header({
								title: `[${this.appName}]:`,
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
								title: `[${this.appName}]:`,
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
							magic("Error Name", err.name);
							magic("Error Message", err.message);
							magic("Error Stack", err.stack ? err.stack : "");
						},
					});
				});

				spinner.stop();
			}
		}
	}

	//Parse options
	private async _parseOptions() {
		//
		await this._parseTypescript();

		await this._parsePackageManager();

		await this._parseInstallDeps();

		await this._parseDocker();
	}

	private async _parseTypescript() {
		this.options.flags.useTypescript ? (this.options.useTypescript = true) : null;
		this.options.flags.useJavascript ? (this.options.useTypescript = false) : null;
	}

	private async _parsePackageManager() {
		const yarnExist = await checkCommand("yarn");
		if (yarnExist) {
			this.options.flags.useYarn ? (this.options.useYarn = true) : null;
			this.options.flags.useNpm ? (this.options.useYarn = false) : null;
		} else {
			this.options.useYarn = false;
		}
	}

	private async _parseInstallDeps() {
		this.options.flags.install ? (this.options.install = true) : null;
		this.options.flags.noInstall ? (this.options.install = false) : null;
	}

	private async _parseDocker() {
		const dockerExist = await checkCommand("docker");
		const dockerComposeExist = await checkCommand("docker-compose");
		if (dockerExist && dockerComposeExist) {
			this.options.flags.docker ? (this.options.useDocker = true) : null;
			this.options.flags.noDocker ? (this.options.useDocker = false) : null;
		} else {
			this.options.useDocker = false;
		}
	}

	//Questions
	private async _askLanguage() {
		if (this.options.flags.language && isValidLanguage(this.options.flags.language)) {
			return this.options.flags.language;
		}

		if (this.options.flags.yes) {
			return 'en';
		}
		return  await askLanguage();
	}

	private async _askProjetName(text: typeof import("i18next")) {
		let projectName = await ask("projectName", text.t("common.ask.projectName"), "app");

		while (
			this._checkIfFolderExist(projectName) ||
			!this._checkIfNameValid(projectName)
		) {
			this._checkIfFolderExist(projectName)
				? error(text.t("common.error.appNameExists"))
				: null;

			!this._checkIfNameValid(projectName)
				? error(text.t("common.error.nameInvalid"))
				: null;

			projectName = await ask("projectName", text.t("common.ask.projectName"), "app");
		}

		this.projectName = projectName;
	}

	protected async _askAppsList(text: typeof import("i18next")) {
		if (this.options.flags.yes && this.inputs.length > 0) {
			this.options.appsList = this.inputs;
			console.log(this.options.appsList);
			return;
		}

		let usrChoices = [];
		while (usrChoices.length == 0) {
			usrChoices = await checkbox(
				text.t("common.ask.templateName"),
				[
					{
						name: `${chalk.hex("#F18E16").bold("ExpressJS")}`,
						value: "express",
						checked: this.inputs.includes("express"),
					},
					{
						name: `${chalk.hex("#24C2FD").bold("ReactJS")}`,
						value: "react",
						checked: this.inputs.includes("react"),
					},
				],
				[]
			);
			usrChoices.length == 0 ? error(text.t("common.error.noApp")) : null;
		}

		this.options.appsList = usrChoices;
	}

	protected async _askOptions(text: typeof import("i18next")) {
		await this._askTypescript(text.t("common.ask.useTypescript"));
		await this._askPackageManager(text.t("common.ask.packageManager"));
		await this._askInstallDeps(text.t("common.ask.installDeps"));
		await this._askDocker(text.t("common.ask.useDocker"));
	}

	private async _askTypescript(text: string) {
		//ask for typescript if not specified
		if (this.options.useTypescript === undefined) {
			if (this.options.flags.yes) {
				this.options.useTypescript = true;
				return;
			}
			try {
				this.options.useTypescript = await confirm(text, true);
			} catch (err) {
				console.log(err);
			}
		}
	}

	private async _askPackageManager(text: string) {
		//package manager
		if (this.options.useYarn === undefined) {
			if (this.options.flags.yes) {
				this.options.useYarn = true;
				this.packageManager = "yarn";
				return;
			}
			try {
				this.options.useYarn = await confirm(text, true);
				this.packageManager = this.options.useYarn ? "yarn" : "npm";
			} catch (err) {
				console.log(err);
			}
		}
	}

	private async _askInstallDeps(text: string) {
		if (this.options.install === undefined) {
			if (this.options.flags.yes) {
				this.options.install = true;
				return;
			}
			try {
				this.options.install = await confirm(text, true);
			} catch (err) {
				console.log(err);
			}
		}
	}

	private async _askDocker(text: string) {
		if (this.options.useDocker === undefined) {
			if (this.options.flags.yes) {
				this.options.useDocker = true;
				return;
			}
			try {
				this.options.useDocker = await confirm(text, true);
			} catch (err) {
				console.log(err);
			}
		}
	}

	private async _askDockerCompose(text: string) {
		if (this.options.useDocker === true && this.options.useDockerCompose === undefined) {
			try {
				this.options.useDockerCompose = await confirm(text, true);
			} catch (err) {
				console.log(err);
			}
		}
	}

	//Resume all the user choices
	private _resumeOptions(text: typeof import("i18next")) {
		if (this.options.useYarn === true) info(text.t("common.info.usingYarn"));
		if (this.options.useYarn === false) info(text.t("common.info.usingNpm"));

		if (this.options.install === true) info(text.t("common.info.installDeps"));

		if (this.options.useTypescript === true) info(text.t("common.info.usingTypescript"));
		if (this.options.useTypescript === false) info(text.t("common.info.usingJavascript"));

		if (this.options.useDocker === true) info(text.t("common.info.usingDocker"));

		if (this.options.useDockerCompose === true)
			info(text.t("common.info.usingDockerCompose"));
	}

	//Loaders

	private _loadAppGenerators() {
		this.options.appsList.forEach((value: string) => {
			const generatorClass = getGenerator(value);

			const generator = this.composeWith(
				{
					Generator: generatorClass,
					path: path.join(path.resolve(path.dirname(this.__filename), "apps", value)),
				},
				{
					useTypescript: this.options.useTypescript,
					useYarn: this.options.useYarn,
					install: this.options.install,
					useDocker: this.options.useDocker,
					useDockerCompose: this.options.useDockerCompose,
					lang: this.language,
					appsList: this.options.appsList,
					projectName: this.projectName,
				},
				true
			);
			this.generators.push({ name: value, generator: generator });
		});
		this.services.setServices(this._getServices());
	}

	private _getServices(): Services {
		return this.generators.reduce((result: Services, { name, generator }) => {
			result[name] = {
				appName: generator.options.appName,
				port: generator.options.port,
				color: generator.options.color,
			};
			return result;
		}, {});
	}

	//File system helpers
	private _checkIfFolderExist(name: string) {
		const destPath = process.cwd();
		return fs.existsSync(path.join(destPath, name));
	}

	private _checkIfNameValid(name: string) {
		return testAppName(name);
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
			const service = this.generators.filter((el) => {
				return container.includes(el.generator.options.appName);
			})[0];

			//Show the logs
			header({
				title: `${container.trim()}`,
				tagLine: `[${dateFormat}]`,
				description: lines,
				version: "",
				bgColor: service ? service.generator.options.color : this.color,
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
				const generatorColor = this.generators.filter((el) => {
					return line.includes(el.generator.options.appName);
				});

				//which color, service or default
				const lineColor =
					generatorColor.length && generatorColor.length >= 1
						? generatorColor[0].generator.options.color
						: "#ffffff";
				log(
					`${chalk.magenta.bold(`${this.appName}`)}: ${chalk.hex(lineColor).bold(line)}`
				);
				spinner.text = arr ? chalk.hex(lineColor).bold(arr[arr.length - 1]) : "...";
			});
		}
	}
}
