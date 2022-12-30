import Generator from "yeoman-generator";
import fse from "fs-extra";
import { lang } from "../../translate.js";
import path from "path";
import inquirer from "inquirer";
import { fileURLToPath } from "url";
import BaseGenerator from "../classes/BaseGenerator.js";
import { error, info, log, magic, success, sep } from "../../utils/log.js";
import { ask, confirm } from "../../utils/ask.js";
import fs from "fs";
import chalk from "chalk";
import ora from "ora";
import header from "../../utils/init.js";
import TypescriptGenerator from "../express/typescript.js";
import DockerGenerator from "../express/docker.js";
export default class extends BaseGenerator {
	//Langage helper
	//Filename Helper
	__filename = fileURLToPath(import.meta.url);

	//other generators
	dockerGenerator: Generator<Generator.GeneratorOptions> | null = null;
	typescriptGenerator: Generator<Generator.GeneratorOptions> | null = null;

	// The name `constructor` is important here
	constructor(args: string | string[], opts: Generator.GeneratorOptions, template: string) {
		// Calling the super constructor is important so our generator is correctly set up
		super(args, opts, template);
	}

	async prompting() {
		this.text = await lang.getInstance(this.options.lang);
		//Ask to enter the projetName
		await this._askAppName();

		//Get the options
		const chosenOptions = await this._askOptions();

		// To access props later use this.props.someAnswer;
		this.options = {
			...this.options,
			chosenOptions,
			projectName: this.projectName,
			appName: this.appName,
		};

		const __filename = fileURLToPath(import.meta.url);

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
			{
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
			},
			{}
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
		await this.spawnCommand(
			`cd ${path.join(this._getAppPath())} && ${
				this.options.useYarn ? "yarn" : "npm"
			} install`,
			[],
			{
				shell: true,
				stdio: "ignore",
				// cwd: process.cwd()
			}
		);
		spinner.stop();
	}
	async end() {
		const text = await lang.getInstance(this.options.lang);
		if (!this.options.install) {
			return;
		}
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
			log(`${chalk.blue.bold("-----------------------------------")}`);
			header({
				title: `Docker cotainer`,
				tagLine: `Simple Development Environment`,
				description: [
					`${
						chalk.green(` ${this.packageManager} run docker:build:dev `) +
						": Remove old Dev Mode image and build new Dev Mode image."
					}`,
					`${chalk.green(
						` ${this.packageManager} run docker:dev`
					)} : Build the Dev Mode image and run a container with Hot Reload (Removed when exit).`,
					`${
						chalk.magenta(` ${this.packageManager}  docker:build `) +
						` : 'Build the Prod Image.`
					}`,
					`${
						chalk.magenta(` ${this.packageManager}  docker:run `) +
						` : 'Build the Prod Image and deploy the Prod Container.`
					}`,
					`${
						chalk.red(` ${this.packageManager} docker:remove `) +
						" : Remove the Prod Container."
					}`,
				],
				version: "",
				bgColor: "#36BB09",
				color: "#000000",
				bold: true,
				clear: false,
			});
			log(`${chalk.blue.bold("-----------------------------------")}`);
			if (this.options.useDockerCompose) {
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

		const prompts = [
			{
				type: "confirm",
				name: "start",
				message: text.t("express.ask.startServer"),
				default: true,
			},
		];

		const props = await this.prompt(prompts);

		if (props.start) {
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
				this._spawnCommand(`${this.packageManager} run dev`, {
					stdout: (arr) => {
						this._logLines(arr, (line) => {
							magic("info", line);
						});
					},
					stderr: (arr) => {
						this._logLines(arr, (line) => {
							magic("info", line);
						});
					},
					close: (code, arr) => {
						this._logLines(arr, (line) => {
							magic("Closing", "See you later!");
						});
					},
					exit: (code, arr) => {
						this._logLines(arr, (line) => {
							magic("Exiting", "See you later!");
						});
					},
					error: (err) => {},
				});
				return;
			}
		}
	}

	//Prompt helpers
	private async _askAppName() {
		if (this.text) {
			let appName = await ask("appName", this.text.t("common.ask.appName"), "app");

			while (
				fs.existsSync(path.join(this._getProjectPath(), appName)) ||
				!/^[a-z][a-z0-9]*(?:[._-][a-z0-9]+)*$/.test(appName)
			) {
				if (fs.existsSync(path.join(this._getProjectPath(), appName))) {
					error(this.text.t("common.ask.appNameExists"));
				}
				if (!/^[a-z][a-z0-9]*(?:[._-][a-z0-9]+)*$/.test(appName)) {
					error(this.text.t("common.ask.nameInvalid"));
				}
				appName = await ask("projectName", this.text.t("common.ask.appName"), "app");
			}
			this.appName = appName;
			return this.appName;
		}
	}

	//Generator Loaders
	private _loadTypescript() {
		this.typescriptGenerator = this.composeWith(
			{
				Generator: TypescriptGenerator,
				path: path.resolve(path.dirname(this.__filename), ".." , "express", `typescript.js`),
			},
			{
				appName: this.appName,
				...this.options,
				useDocker: this.options.useDocker,
			}
		);
	}

	private _loadDocker() {
		this.dockerGenerator = this.composeWith(
			{
				Generator: DockerGenerator,
				path: path.resolve(path.dirname(this.__filename) , ".." , "express", `docker.js`),
			},
			{ appName: this.appName, ...this.options },
			true
		);
	}

	protected  _askOptions(): Promise<string[]>{
    return new Promise(()=>{return []})
  };

	protected  _loadOptionsGenerators(): void{

  };
}
