import { ChildProcessWithoutNullStreams, spawn } from "child_process";
import ora from "ora";
import path from "path";
import { fileURLToPath } from "url";
import Generator from "yeoman-generator";
import { ChildProcessTracker } from "../utils/childs_processes.js";
import { ServicesTracker } from "./apps/ServicesTracker.js";
import header from "../utils/init.js";
import { ProcessCallbacks } from "../utils/commands.js";

export default class BaseGenerator extends Generator {
	// For translations
	text: typeof import("i18next") | undefined;

	// Paths helpers
	__filename = fileURLToPath(import.meta.url);
	templateFolderPath: string;
	destinationFolderPath: string;

	//Generator settings
  
	projectName: string;
	appName: string = "app";
	inputs: Array<string>;
	packageManager: string;
  language: string = "en";
  
	//Tracking apps
	tracker = ChildProcessTracker.getInstance();
	services = ServicesTracker.getInstance();

	//Spnner for loading
	spinner = ora("");
	color: string = "#36F139";

	constructor(
		args: string | string[],
		opts: Generator.GeneratorOptions,
		templateName: string
	) {
		// Calling the super constructor is important so our generator is correctly set up
		super(args, opts);
		const __filename = fileURLToPath(import.meta.url);

		this.templateFolderPath = path.resolve(
			path.dirname(__filename),
			`..`,
			"..",
			"templates",
			templateName
		);

		this.destinationFolderPath = path.normalize(this.destinationPath());
		this.projectName = opts.projectName;
		this.packageManager = this.options.useYarn ? "yarn" : "npm";
		this.inputs = opts.input;
	}

	async initializing() {}

	//Comands Helpers
	// Get a process and assign eventListeners (stdout, sterr, error, exit, close)
	private _handleChildEvent = (
		ls: ChildProcessWithoutNullStreams,
		callbacks: ProcessCallbacks,
		exit?: boolean
	) => {
		ls.stdout?.on("data", (data: any) => {
			let arr = data
				.toString()
				.split("\n")
				.filter((el: string) => el != "");
			callbacks.stdout(arr);
		});

		ls.stderr?.on("data", (data: any) => {
			let arr = data
				.toString()
				.split("\n")
				.filter((el: string) => el != "");
			callbacks.stderr(arr);
		});

		ls.on("error", (error) => {
			let arr = [error.name, error.message, error.stack];
			callbacks.error({ ...error });
		});

		ls.on("close", (code: any) => {
			let arr = ["close"];
			callbacks.close(code, arr);
			this.tracker.removeChildProcess(ls);
			if (this.tracker.getChildProcesses().length === 0 && exit === undefined) {
				process.exit();
			}
			this.spinner.stop();
			return;
		});
		ls.on("exit", (code: any) => {
			let arr = ["exit"];
			callbacks.exit(code, arr);
			this.spinner.stop();
			return;
		});
	};

	// Spawn a command in the app folder and add listeners
	protected _spawnCommand(
		commandPath: string,
		command: string,
		callbacks: ProcessCallbacks,
		exit?: boolean
	) {
		this.spinner.stop();

		const nodemonProcess = spawn(`cd ${commandPath} && ${command}`, [], {
			shell: true,
			stdio: "pipe",
			// cwd: process.cwd()
		});

		this.tracker.addChildProcess(nodemonProcess);

		this._handleChildEvent(nodemonProcess, callbacks, exit);
	}

	protected _spawnCommandApp(
		command: string,
		callbacks: ProcessCallbacks,
		exit?: boolean
	) {
		this._spawnCommand(this._getAppPath(), command, callbacks, exit);
	}

	protected _spawnCommandProject(
		command: string,
		callbacks: ProcessCallbacks,
		exit?: boolean
	) {
		this._spawnCommand(this._getProjectPath(), command, callbacks, exit);
	}

	//Helpers:

	//Log bunch of line one by one using a callback
	protected _logLines(tagline: string, arr: string[]) {
		header({
			title: `${this.appName}`,
			tagLine: tagline,
			description: arr,
			version: "",
			bgColor: this.color,
			color: "#000000",
			bold: true,
			clear: false,
		});
	}
	protected _getProjectPath() {
		return path.join(this.destinationFolderPath, this.projectName);
	}

	protected _getAppPath() {
		return path.join(this._getProjectPath(), this.appName);
	}
}


