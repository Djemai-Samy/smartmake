import Generator from "yeoman-generator";
import { lang } from "../../translate.js";
import path from "path";
import fs from "fs";
import BaseGenerator from "../classes/BaseGenerator.js";
import { log, magic } from "../../utils/log.js";
import chalk from "chalk";
import header from "../../utils/init.js";
export default class extends BaseGenerator {
	// The name `constructor` is important here
	constructor(args: string | string[], opts: Generator.GeneratorOptions) {
		// Calling the super constructor is important so our generator is correctly set up
		super(args, opts, "express/docker");

		this.appName = this.options.appName;
	}

	async prompting() {
		// Have Yeoman greet the user.
		// const text = await lang.getInstance(this.options.lang);
	}
	async writing() {
		const text = await lang.getInstance(this.options.lang);

		//Files with templeting:
		this.fs.copyTpl(
      path.join(this.templateFolderPath, "Dockerfile"),
			path.join(this._getAppPath(), "Dockerfile"),
			{
				projectName: this.options.projectName,
        appName: this.appName,
				text: text,
				packageManager: this.options.useYarn ? "yarn" : "npm",
				useTypescript: this.options.useTypescript,
			}
		);

		if (this.options.useDockerCompose) {
			this.fs.copyTpl(
        path.join(this.templateFolderPath, "docker-compose-dev.yaml"),
				path.join(this._getAppPath(), "docker-compose-dev.yaml"),
				{
					projectName: this.options.projectName,
          appName: this.appName,
					text: text,
					packageManager: this.options.useYarn ? "yarn" : "npm",
					useTypescript: this.options.useTypescript,
				}
			);
			this.fs.copyTpl(
        path.join(this.templateFolderPath, "docker-compose.yaml"),
				path.join(this._getAppPath(), "docker-compose.yaml"),
				{
					projectName: this.options.projectName,
          appName: this.appName,
					text: text,
					packageManager: this.options.useYarn ? "yarn" : "npm",
					useTypescript: this.options.useTypescript,
				}
			);
		}
	}
	async install() {}
	async end() {
		if (this.options.start) {
			//Docker
			if (!this.options.useDockerCompose) {
				this.spinner.clear();
				this._spawnCommand(`${this.packageManager} run docker:dev`, {
					stdout: (arr) => {
						this._logLines(arr, (line) => {
							log(`${chalk.blue("docker")} :  ${line}`);
						});
					},
					stderr: (arr) => {
						this._logLines(arr, (line) => {
							magic("docker", line);
						});
					},
					close: (code, arr) => {
						this._logLines(arr, (line) => {
							magic("Closing docker", "See you later!");
						});
					},
					exit: (code, arr) => {
            //Remove image on exit
            this._spawnCommand(`docker rm -f ${this.projectName}-${this.appName}-dev`, {
              stdout: (arr) => {
                this._logLines(arr, (line) => {
                  log(`${chalk.blue("remove docker ")} : ${line}`);
                });
              },
              stderr: (arr) => {
                this._logLines(arr, (line) => {
                  magic("remove docker", line);
                });
              },
              close: (code, arr) => {
                this._logLines(arr, (line) => {
                  magic("Closing remove docker", "See you later!");
                });
              },
              exit: (code, arr) => {
               
                this._logLines(arr, (line) => {
                  magic("Exiting remove docker", "Hang on a minute...");
                });
              },
              error: (err) => {
              },
            })
						this._logLines(arr, (line) => {
							magic("Eciting docker", "Hang on a minute...");
						});
					},
					error: (err) => {
						magic("Error Name", err.name);
						magic("Error Message", err.message);
						magic("Error Stack", err.stack ? err.stack : "");
					},
				});
			} else {
				//Docker Compose
				this._spawnCommand(`${this.packageManager} run compose:dev`, {
					stdout: (arr) => {
						this._logLines(arr, (line) => {
							log(`${chalk.blue("docker compose")} :  ${line}`);
						});
					},
					stderr: (arr) => {
						this._logLines(arr, (line) => {
							magic("docker compose", line);
						});
					},
					close: (code, arr) => {
						magic("Closing docker compose", "See you later!");
					},
					exit: (code, arr) => {
						magic("Eciting docker compose", "Hang on a minute...");
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
}
