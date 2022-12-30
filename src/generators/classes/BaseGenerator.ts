import { ChildProcess, ChildProcessWithoutNullStreams, exec, spawn } from "child_process";
import ora from "ora";
import path from "path";
import { fileURLToPath } from "url";
import { runInThisContext } from "vm";
import Generator from "yeoman-generator";
import { lang } from "../../translate.js";
import { ChildProcessTracker } from "../../utils/childs_processes.js";
import { log } from "../../utils/log.js";

export default class BaseGenerator extends Generator {
	text: typeof import("i18next") | undefined;
  templateFolderPath: string;
	destinationFolderPath: string;
	projectName: string;
  appName: string = "app";
	packageManager: string;
	tracker = ChildProcessTracker.getInstance();
	//Loading helper
	spinner = ora("");
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
			"..",
			"templates",
			templateName
		);

		this.destinationFolderPath = path.normalize(this.destinationPath());
		this.projectName = opts.projectName;
		this.packageManager = this.options.useYarn ? "yarn" : "npm";
	}

  async initializing(){
  }

	//Comands Helpers

	// Get a process and assign eventListeners (stdout, sterr, error, exit, close)
	private _handleChildEvent = (
		ls: ChildProcessWithoutNullStreams,
		callbacks: ProcessCallbacks
	) => {
		
		ls.stdout?.on("data", (data: any) => {
			let arr = data.toString().split("\n");
			callbacks.stdout(arr);
		});

		ls.stderr?.on("data", (data: any) => {
			let arr = data.toString().split("\n");
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
			if (this.tracker.getChildProcesses().length === 0) {
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
	protected _spawnCommand(command: string, callbacks: ProcessCallbacks) {
		this.spinner.stop();

		const nodemonProcess = spawn(
			`cd ${path.join(this._getAppPath())} && ${command}`,
			[],
			{
				shell: true,
				stdio: "pipe",
				// cwd: process.cwd()
			}
		);

		this.tracker.addChildProcess(nodemonProcess);

		this._handleChildEvent(nodemonProcess, callbacks);
	}

	//Helpers:

	//Log bunch of line one by one using a callback
	protected _logLines(arr: string[], callback: (el: string) => void) {
		arr.forEach((el) => {
			this.spinner.stop();
			el !== "" ? callback(el) : null;
			this.spinner.text = el;
			this.spinner.start();
		});
	}
  protected _getProjectPath(){
    return path.join(this.destinationFolderPath, this.projectName);
  }

  protected _getAppPath(){
    return path.join(this._getProjectPath(), this.appName);
  }
}

type ProcessCallbacks = {
	stdout: (data: string[]) => void;
	stderr: (data: string[]) => void;
	close: (code: number, data: string[]) => void;
	exit: (code: number, data: string[]) => void;
	error: (data: { name: string; message: string; stack?: string | undefined }) => void;
};

