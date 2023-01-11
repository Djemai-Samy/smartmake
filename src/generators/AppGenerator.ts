import Generator from "yeoman-generator";
import fse from "fs-extra";
import { lang } from "../translate.js";
import path from "path";
import { fileURLToPath } from "url";
import BaseGenerator, { ProcessCallbacks } from "./BaseGenerator.js";
import { error, info, log, magic, success, sep } from "../utils/log.js";
import { ask } from "../utils/ask.js";
import fs from "fs";
import chalk from "chalk";
import ora from "ora";
import header from "../utils/init.js";
import TypescriptGenerator from "./TypescriptGenerator.js";
import DockerGenerator from "./DockerGenerator.js";
import { spawn } from "child_process";
import { ServicesTracker } from "./apps/ServicesTracker.js";
export default class extends BaseGenerator {
	//Filename Helper
	port: any;

	//other generators
	dockerGenerator: Generator<Generator.GeneratorOptions> | null = null;
	typescriptGenerator: Generator<Generator.GeneratorOptions> | null = null;

	template: string;

	// The name `constructor` is important here
	constructor(
		args: string | string[],
		opts: Generator.GeneratorOptions,
		template: string
	) {
		// Calling the super constructor is important so our generator is correctly set up
		super(args, opts, template);
		this.template = template;
	}

	async prompting() {
		this.text = await lang.getInstance(this.options.lang);
		//Ask to enter the projetName
		await this._askAppName();

    await this._askPort();

    //Update the singleton that tracks services
    this._updateServices();

		//Get the options
		const chosenOptions = await this._askOptions();

		// To access props later use this.props.someAnswer;
		this.options = {
			...this.options,
			chosenOptions,
			projectName: this.projectName,
			appName: this.appName,
		};

		if (this.options.useTypescript) {
			this._loadTypescript();
		}

		if (this.options.useDocker) {
			this._loadDocker();
		}
	}
	async writing() {
		//Create app folder
		fse.mkdir(`${this._getAppPath()}`);

		//Files with templeting:
		this.fs.copyTpl(
			`${this.templateFolderPath}/**/*`,
			this._getAppPath(),
			this._getTemplateData(),
			{},
			{ globOptions: { dot: true } }
		);

		//Change workdir for deps installations
		const destinationRoot = this.destinationRoot(this._getAppPath());
		this.env.cwd = destinationRoot;
	}
	async install() {
		if (!this.options.install) {
			return;
		}
		const spinner = ora("Installing dependecies");
		spinner.start();
		await new Promise<void>((resolve, reject) => {
			this._spawnCommandApp(
				`${this.packageManager} install`,
				{
					stdout: (arr) => {
						spinner.text = arr.join("\n");
					},
					stderr: (arr) => {
						spinner.text = arr.join("\n");
					},
					exit: (code, arr) => {
						spinner.text = arr.join("\n");
					},
					close: (code, arr) => {
						resolve();
					},
					error: (err) => {},
				},
				false
			);
		});

		spinner.stop();
		const useTypescript = this.options.useTypescript;
		info("We are almost there! Here's a list of usefull comands:");
		header({
			title: `Localhost`,
			tagLine: `Simple Development Environment`,
			description: [
				`${
					useTypescript
						? chalk.green(` ${this.packageManager} run watch `) +
						  ": Build or re-build a dist folder the app."
						: ""
				}`,
				`${chalk.green(
					` ${this.packageManager} run dev`
				)} : Deploy in Dev Mode with Hot Reload.`,
				`${
					useTypescript
						? chalk.magenta(` ${this.packageManager} run build `) +
						  " : Build or re-build a dist folder the app."
						: ""
				}`,
				`${
					chalk.magenta(` ${this.packageManager} run start `) +
					`${
						useTypescript ? "'Build a dist folder and deploy the app." : "Deploy the app."
					}`
				}`,
			],
			version: "",
			bgColor: "#36BB09",
			color: "#000000",
			bold: true,
			clear: false,
		});

		if (this.options.useDocker) {
			// log(`${chalk.blue.bold("-----------------------------------")}`);
			// header({
			// 	title: `Docker cotainer`,
			// 	tagLine: `Simple Development Environment`,
			// 	description: [
			// 		`${
			// 			chalk.green(` ${this.packageManager} run docker:build:dev `) +
			// 			": Remove old Dev Mode image and build new Dev Mode image."
			// 		}`,
			// 		`${chalk.green(
			// 			` ${this.packageManager} run docker:dev`
			// 		)} : Build the Dev Mode image and run a container with Hot Reload (Removed when exit).`,
			// 		`${
			// 			chalk.magenta(` ${this.packageManager}  docker:build `) +
			// 			` : 'Build the Prod Image.`
			// 		}`,
			// 		`${
			// 			chalk.magenta(` ${this.packageManager}  docker:run `) +
			// 			` : 'Build the Prod Image and deploy the Prod Container.`
			// 		}`,
			// 		`${
			// 			chalk.red(` ${this.packageManager} docker:remove `) +
			// 			" : Remove the Prod Container."
			// 		}`,
			// 	],
			// 	version: "",
			// 	bgColor: "#36BB09",
			// 	color: "#000000",
			// 	bold: true,
			// 	clear: false,
			// });
			log(`${chalk.blue.bold("-----------------------------------")}`);
			if (this.options.useDocker) {
				header({
					title: `Docker Compose`,
					tagLine: `Simple Development Environment`,
					description: [
						`${
							chalk.green(` ${this.packageManager} run compose:dev `) +
							": Build the Dev Image and deploy the Dev Stack with Hot Reload."
						}`,
						`${chalk.magenta(
							` ${this.packageManager} run compose:up`
						)} : Build the Prod Image and deploy the Prod Stack.`,
					],
					version: "",
					bgColor: "#36BB09",
					color: "#000000",
					bold: true,
					clear: false,
				});
				log(`${chalk.blue.bold("-----------------------------------")}`);
			}
		}
	}
	async end() {
		const text = await lang.getInstance(this.options.lang);
		if (!this.options.install) {
			return;
		}

		if (this.options.start) {
			if (this.dockerGenerator) {
				this.dockerGenerator.options.start = true;
			}

			if (this.typescriptGenerator) {
				this.typescriptGenerator.options.start = true;
				this.typescriptGenerator.options.useDocker = true;
			}
			this.spinner.start();

			// No Docker
			if (!this.options.useDocker) {
				this._spawnCommandApp(`${this.packageManager} run dev`, {
					stdout: (arr) => {
						this._logLines(arr, (line) => {
							magic(`[${this.appName.toUpperCase()}]`, line);
						});
					},
					stderr: (arr) => {
						this._logLines(arr, (line) => {
							magic(`[${this.appName.toUpperCase()}]`, line);
						});
					},
					close: (code, arr) => {
						this._logLines(arr, (line) => {
							magic(`[${this.appName.toUpperCase()}]`, "Closed! See you later!");
						});
					},
					exit: (code, arr) => {
						this._logLines(arr, (line) => {
							magic(`[${this.appName.toUpperCase()}]`, "Stopping! Hang on a minute...");
						});
					},
					error: (err) => {},
				});
				return;
			}
		}
	}

	//Prompt helpers
	protected async _askAppName() {}

	protected async _askPort() {
  }
  protected async _updateServices() {
    
    this.services.addServices(this.template.split('/')[0], {appName: this.appName, port: this.port})
  }

	protected _getTemplateData() {

		return {
			projectName: this.options.projectName,
			appName: this.options.appName,
			destPath: path
				.join(path.resolve(this._getAppPath()))
				.split(path.sep)
				.join(path.posix.sep),
			text: this.text,
			packageManager: this.options.useYarn ? "yarn" : "npm",
			useTypescript: this.options.useTypescript,
			useDocker: this.options.useDocker,
			useDockerCompose: this.options.useDockerCompose ? true : false,
			port: this.options.port,
      services: this.services.getServices()
		};
	}

	//Generator Loaders
	private _loadTypescript() {
		this.typescriptGenerator = this.composeWith(
			{
				Generator: TypescriptGenerator,
				path: path.resolve(path.dirname(this.__filename), `TypescriptGenerator.js`),
			},
			{
				appName: this.appName,
				...this.options,
				useDocker: this.options.useDocker,
				template: this.template.split("/")[0],
			}
		);
	}

	private _loadDocker() {
		this.dockerGenerator = this.composeWith(
			{
				Generator: DockerGenerator,
				path: path.resolve(path.dirname(this.__filename), `DockerGenerator.js`),
			},
			{ appName: this.appName, ...this.options, template: this.template.split("/")[0] },
			true
		);
	}

	protected _askOptions(): Promise<string[]> {
		return new Promise(() => {
			return [];
		});
	}

	protected _loadOptionsGenerators(): void {}
}
