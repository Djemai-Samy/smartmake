import Generator from "yeoman-generator";
import fse from "fs-extra";
import { lang } from "../translate.js";
import path from "path";
import BaseGenerator from "./BaseGenerator.js";
import { log, } from "../utils/log.js";
import chalk from "chalk";
import ora from "ora";
import header from "../utils/init.js";
import TypescriptGenerator from "./TypescriptGenerator.js";
import DockerGenerator from "./DockerGenerator.js";
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
		const text = await lang.getInstance(this.options.lang);
		const spinner = ora(text.t("common.info.dependecies.install"));
		spinner.start();
		await new Promise<void>((resolve, reject) => {
			this._spawnCommandApp(
				`${this.packageManager} install`,
				{
					stdout: (arr) => {
						spinner.text = `${chalk.hex(this.color).bold(this.appName)}: ${arr.join(
							"\n"
						)}`;
					},
					stderr: (arr) => {
						spinner.text = `${chalk.hex(this.color).bold(this.appName)}: ${arr.join(
							"\n"
						)}`;
					},
					exit: (code, arr) => {
						spinner.clear()
					},
					close: (code, arr) => {
						log(
							chalk
								.hex(this.color)
								.bold(`${text.t("common.info.dependencies.installed")}: ${this.appName}`)
						);
						spinner.clear()
						resolve();
					},
					error: (err) => {
						log(`Error for ${this.appName}: ${err}`);
					},
				},
				false
			);
		});

		spinner.stop();
		const useTypescript = this.options.useTypescript;

		this._showStartDoc(text);
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
				//Adding some timestamp to the log
				const date = new Date();
				const dateFormat = `${date.toLocaleString()}`;

        const spinner = ora("Stating server...");
				spinner.start();
				
        this._spawnCommandApp(`${this.packageManager} run dev`, {
					stdout: (arr) => {
            spinner.clear();
						this._logLines(`${date.toLocaleString()}`, arr);
            //Show stop command in the spinner
			      spinner.text = `${chalk.green("Waiting...")} 'CTRL + C' to ${chalk.red("stop!")}`;
					},
					stderr: (arr) => {
            spinner.clear();
						header({
							title: `${this.appName}`,
							tagLine: `${dateFormat}`,
							description: arr,
							version: "",
							bgColor: this.color,
							color: "#000000",
							bold: true,
							clear: false,
						});
            spinner.text = `${chalk.green("Waiting...")} 'CTRL + C' to ${chalk.red("stop!")}`;
					},
					exit: (code, arr) => {
						header({
							title: `${this.appName}`,
							tagLine: `Stopping...`,
							description: "",
							version: "",
							bgColor: this.color,
							color: "#000000",
							bold: true,
							clear: false,
						});
            spinner.clear();
					},
					close: (code, arr) => {
            spinner.clear();
						header({
							title: `${this.appName}`,
							tagLine: `Closed!`,
							description: "",
							version: "",
							bgColor: this.color,
							color: "#000000",
							bold: true,
							clear: false,
						});
            spinner.stop();
					},
					error: (err) => {},
				});
				return;
			}
		}
	}

	//Prompt helpers
	protected async _askAppName() {}

	protected async _askPort() {}
  
	protected async _updateServices() {
		this.services.addServices(this.template.split("/")[0], {
			appName: this.appName,
			port: this.port,
			color: this.color,
		});
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
			services: this.services.getServices(),
		};
	}

	protected _showStartDoc(text: typeof import("i18next")) {}

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
