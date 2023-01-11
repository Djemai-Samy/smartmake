import Generator from "yeoman-generator";
import { lang } from "../../translate.js";
import { ask, list, confirm, checkbox } from "../../utils/ask.js";
import { checkCommand } from "../../utils/commands.js";
import { error, log, magic } from "../../utils/log.js";
import BaseGenerator from "../BaseGenerator.js";
import fs from "fs";
import fse from "fs-extra";
import path from "path";
import { info } from "console";
import ExpressGenerator from "./express/index.js";
import chalk from "chalk";
import { getGenerator } from "./AppFactory.js";
import { Services, ServicesTracker } from "./ServicesTracker.js";
import { testAppName } from "../../utils/validation.js";
export default class ProjectGenerator extends BaseGenerator {
	generators: { name: string; generator: Generator }[] = [];

	// The name `constructor` is important here
	constructor(args: string | string[], opts: Generator.GeneratorOptions) {
		// Calling the super constructor is important so our generator is correctly set up
		super(args, opts, "base");
	}

	async prompting() {
		await this._parseOptions();

		await this._askLanguage();

		const text = await lang.getInstance(this.options.lang);

		await this._askProjetName(text);

		await this._askAppsList(text.t("common.ask.templateName"));

		await this._askOptions(text);

		this._resumeOptions(text);

		this._loadAppGenerators();
	}
	async writing() {
    fse.mkdir(`${this.projectName}`);
		const text = await lang.getInstance(this.options.lang);
    
    // this.fs.copyTpl(`${this.templateFolderPath}/package.json`, this._getProjectPath(), {
    //   projectName: this.projectName,
    //   text: text,
    //   packageManager: this.options.useYarn ? "yarn" : "npm",
    //   useTypescript: this.options.useTypescript,
    //   services: this.services,
    // });

		if (this.options.useDocker) {
      
			this.fs.copyTpl(`${this.templateFolderPath}/**/*`, this._getProjectPath(), {
				projectName: this.projectName,
				text: text,
				packageManager: this.options.useYarn ? "yarn" : "npm",
				useTypescript: this.options.useTypescript,
				services: this.services.getServices(),
			});
		}

    this.fs.copyTpl(`${this.templateFolderPath}/package.json`, `${this._getProjectPath()}/package.json`, {
      projectName: this.projectName,
      text: text,
      packageManager: this.options.useYarn ? "yarn" : "npm",
      useTypescript: this.options.useTypescript,
      useDocker:this.options.useDocker,
      services: this.services.getServices(),
    }, {}, {});
	}
	async install() {}
	async end() {
		const text = await lang.getInstance(this.options.lang);
		const start = await confirm(text.t("common.ask.startServer"), true);
		if (start) {
			this.generators.forEach((gen) => (gen.generator.options.start = true));
			if (this.options.useDocker) {
				//Docker Compose
				this._spawnCommandProject(`${this.packageManager} run compose:dev`, {
					stdout: (arr) => {
						this._logLines(arr, (line) => {
							log(`${chalk.blue("[DOCKER COMPOSE]")} :  ${line}`);
						});
					},
					stderr: (arr) => {
						this._logLines(arr, (line) => {
							magic("[DOCKER COMPOSE]", line);
						});
					},
					close: (code, arr) => {
						magic("[DOCKER COMPOSE]", "Closed, See you later!");
					},
					exit: (code, arr) => {
						magic("[DOCKER COMPOSE]", "Stoppings, Hang on a minute...");
					},
					error: (err) => {
						magic("Error Name", err.name);
						magic("Error Message", err.message);
						magic("Error Stack", err.stack ? err.stack : "");
					},
				});
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
		//language
		if (
			!this.options.flags.language ||
			(this.options.flags.language !== "en" && this.options.flags.language !== "fr")
		) {
			const language = await list("Choose your language...", ["Français", "English"]);
			switch (language) {
				case "Français":
					this.options.lang = "fr";
					break;
				default:
					this.options.lang = "en";
					break;
			}
		} else {
			this.options.lang = this.options.flags.language;
		}
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

	protected async _askAppsList(text: string) {
		let usrChoices = await checkbox(text, ["ExpressJS", "ReactJS"]);
		this.options.appsList = usrChoices.map((value: string) => {
			switch (value) {
				case "ReactJS":
					return "react";
					break;
				case "ExpressJS":
					return "express";
					break;
			}
		});
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
			try {
				this.options.useYarn = await confirm(text, true);
			} catch (err) {
				console.log(err);
			}
		}
	}

	private async _askInstallDeps(text: string) {
		if (this.options.install === undefined) {
			try {
				this.options.install = await confirm(text, true);
			} catch (err) {
				console.log(err);
			}
		}
	}

	private async _askDocker(text: string) {
		if (this.options.useDocker === undefined) {
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
			const gen = getGenerator(value);

			const expressGenerator = this.composeWith(
				{
					Generator: gen,
					path: path.join(path.resolve(path.dirname(this.__filename), "apps", value)),
				},
				{
					useTypescript: this.options.useTypescript,
					useYarn: this.options.useYarn,
					install: this.options.install,
					useDocker: this.options.useDocker,
					useDockerCompose: this.options.useDockerCompose,
					lang: this.options.lang,
					appsList: this.options.appsList,
					projectName: this.projectName,
				},
				true
			);
			this.generators.push({ name: value, generator: expressGenerator });
      
		});
    this.services.setServices(this._getServices())
	}

	private _getServices() : Services {
		return this.generators.reduce(
			(
				result: Services,
				{ name, generator }
			) => {
				result[name] = {
					appName: generator.options.appName,
					port: generator.options.port,
				};
				return result;
			},
			{}
		);
	}

	//File system helpers
	private _checkIfFolderExist(name: string) {
		const destPath = process.cwd();
		return fs.existsSync(path.join(destPath, name));
	}

	private _checkIfNameValid(name: string) {
		return testAppName(name);
	}
}
