import path from "path";
import Generator from "yeoman-generator";
import { ask } from "../../../utils/ask.js";
import { error, log } from "../../../utils/log.js";
import AppGenerator from "../../AppGenerator.js";
import fs from 'fs';
export default class ReactGenerator extends AppGenerator {
  // The name `constructor` is important here
	constructor(args: string | string[], opts: Generator.GeneratorOptions) {
		// Calling the super constructor is important so our generator is correctly set up
		super(args, opts, "react/base");
	}

  async prompting(): Promise<void> {
    await super.prompting()
  }
  async writing() {
    await super.writing()

	}
	async install() {
    await super.install()
		
	}
	async end() {
    await super.end()
		
	}

  protected async _askAppName() {
		if (this.text) {
			let appName = await ask("appName", this.text.t("react.ask.appName"), "front");

			while (
				this.services.isNameUsed(appName) ||
				!/^[a-z][a-z0-9]*(?:[._-][a-z0-9]+)*$/.test(appName)
			) {
				if (this.services.isNameUsed(appName)) {
					error(this.text.t("common.error.appNameExists"));
				}
				if (!/^[a-z][a-z0-9]*(?:[._-][a-z0-9]+)*$/.test(appName)) {
					error(this.text.t("common.error.nameInvalid"));
				}
				appName = await ask("projectName", this.text.t("react.ask.appName"), "front");
			}
			this.appName = appName;
		}
	}
  protected async _askPort() {
		if (this.text) {
			let port = await ask("port", this.text.t("react.ask.port"), "3000");
			while (!/^[0-9]{1,5}$/.test(port) || this.services.isPortUsed(port)) {
				if(!/^[0-9]{1,5}$/.test(port)){
          error(this.text.t("common.server.error.port"));
        }

        if(this.services.isPortUsed(port)){
          error(this.text.t("common.server.error.portUsed"));
        }
				port = await ask("port", this.text.t("react.ask.port"), "3000");
			}
			this.options.port = port;
			this.port = port;
		}
	}

	protected async _askOptions() {
    // log("Asking options!!!")
		return [];
	}

  protected _loadOptionsGenerators(): void {
    // log("LOADING!!!")
  }

}
