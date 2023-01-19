import path from "path";
import Generator from "yeoman-generator";
import { ask } from "../../../utils/ask.js";
import { error, log } from "../../../utils/log.js";
import AppGenerator from "../../AppGenerator.js";
import fs from "fs";
import { testAppName, testPort } from "../../../utils/validation.js";
import header from "../../../utils/init.js";
import chalk from "chalk";
export default class ExpressGenerator extends AppGenerator {
	// The name `constructor` is important here
	constructor(args: string | string[], opts: Generator.GeneratorOptions) {
		// Calling the super constructor is important so our generator is correctly set up
		super(args, opts, "express/base");
		this.color = "#F18E16";
		this.options.color = this.color;
	}

	async prompting(): Promise<void> {
		await super.prompting();
	}
	async writing() {
		await super.writing();
	}
	async install() {
		await super.install();
	}
	async end() {
		await super.end();
	}

	protected async _askAppName() {
		if (this.text) {
			let appName = await ask("appName", this.text.t("express.ask.appName"), "server");

			while (this.services.isNameUsed(appName) || !testAppName(appName)) {
				if (this.services.isNameUsed(appName)) {
					error(this.text.t("common.error.appNameExists"));
				}
				if (!testAppName(appName)) {
					error(this.text.t("common.error.nameInvalid"));
				}
				appName = await ask("projectName", this.text.t("express.ask.appName"), "server");
			}
			this.appName = appName;
		}
	}
	protected async _askPort() {
		if (this.text) {
			let port = await ask("port", this.text.t("express.ask.port"), "3001");

			while (!testPort(port) || this.services.isPortUsed(port)) {
				if (!testPort(port)) {
					error(this.text.t("common.server.error.port"));
				}

				if (this.services.isPortUsed(port)) {
					error(this.text.t("common.server.error.portUsed"));
				}

				port = await ask("port", this.text.t("express.ask.port"), "3001");
			}
			this.options.port = port;
			this.port = port;
		}
	}

	protected async _askOptions() {
		console.log();
		// log("Asking options!!!")
		return [];
	}

	protected _loadOptionsGenerators(): void {
		// log("LOADING!!!")
	}

	protected _showStartDoc(text: typeof import("i18next")) {
		const useTypescript = this.options.useTypescript;

		header({
			title: `${this.appName} (ExpressJS) on localhost:${this.port}`,
			tagLine: `cd ${this.projectName}/${this.appName}`,
			description: [
				`${chalk.green(` ${this.packageManager} run dev`)} : ${text.t(
					"express.commands.dev"
				)}`,
				`${
					useTypescript
						? `${chalk.green(` ${this.packageManager} run build`)} : ${text.t(
								"express.commands.build"
						  )}`
						: ""
				}`,
        `${chalk.green(` ${this.packageManager} run start`)} : ${text.t(
					"express.commands.start"
				)}`,
			],
			version: "",
			bgColor: this.color,
			color: "#000000",
			bold: true,
			clear: false,
		});
	}
}
