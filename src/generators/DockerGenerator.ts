import Generator from "yeoman-generator";

import path from "path";
import BaseGenerator, { ProcessCallbacks } from "./BaseGenerator.js";
import chalk from "chalk";
import { lang } from "../translate.js";
import { log, magic } from "../utils/log.js";
export default class extends BaseGenerator {
	// The name `constructor` is important here
	constructor(args: string | string[], opts: Generator.GeneratorOptions) {
		// Calling the super constructor is important so our generator is correctly set up
		super(args, opts, path.join(opts.template, "docker"));

		this.appName = this.options.appName;
   
	}

	async prompting() {}
	async writing() {
		const text = await lang.getInstance(this.options.lang);

		//Files with templeting:
		this.fs.copyTpl(
			`${this.templateFolderPath}/**/*`,
			path.join(this._getAppPath()),
			{
				projectName: this.options.projectName,
				appName: this.appName,
				text: text,
				packageManager: this.options.useYarn ? "yarn" : "npm",
				useTypescript: this.options.useTypescript,
        services: this.services.getServices(),
        port: this.options.port
			}
		);
	}
	async install() {}
	async end() {
		if (this.options.start) {
			//Docker
			// if (!this.options.useDockerCompose) {
			// 	this.spinner.clear();
			// 	this._spawnCommandApp(`${this.packageManager} run docker:dev`, {
			// 		stdout: (arr) => {
			// 			this._logLines(arr, (line) => {
			// 				log(`${chalk.blue(`[DOCKER ${this.appName}`)} :  ${line}`);
			// 			});
			// 		},
			// 		stderr: (arr) => {
			// 			this._logLines(arr, (line) => {
			// 				magic(`[DOCKER ${this.appName}`, line);
			// 			});
			// 		},
			// 		close: (code, arr) => {
			// 			this._logLines(arr, (line) => {
			// 				magic(`[DOCKER ${this.appName}]`, "Closed, see you later!");
			// 			});
			// 		},
			// 		exit: (code, arr) => {
			// 			//Remove image on exit
			// 			this._spawnCommandApp(
			// 				`docker rm -f ${this.projectName}-${this.appName}-dev`,
			// 				{
			// 					stdout: (arr) => {
			// 						this._logLines(arr, (line) => {
			// 							log(`${chalk.blue("remove docker ")} : ${line}`);
			// 						});
			// 					},
			// 					stderr: (arr) => {
			// 						this._logLines(arr, (line) => {
			// 							magic("remove docker", line);
			// 						});
			// 					},
			// 					close: (code, arr) => {
			// 						this._logLines(arr, (line) => {
			// 							magic("Closing remove docker", "See you later!");
			// 						});
			// 					},
			// 					exit: (code, arr) => {
			// 						this._logLines(arr, (line) => {
			// 							magic("Exiting remove docker", "Hang on a minute...");
			// 						});
			// 					},
			// 					error: (err) => {},
			// 				}
			// 			);
			// 			this._logLines(arr, (line) => {
			// 				magic(`[DOCKER ${this.appName}]`, "Closing! Hang on a minute...");
			// 			});
			// 		},
			// 		error: (err) => {
			// 			magic("Error Name", err.name);
			// 			magic("Error Message", err.message);
			// 			magic("Error Stack", err.stack ? err.stack : "");
			// 		},
			// 	});
			// }
		}
	}
}
