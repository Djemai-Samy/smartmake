import Generator from "yeoman-generator";
import fse from "fs-extra";
import { lang } from "../../translate.js";
import path from "path";
import inquirer from "inquirer";
import { fileURLToPath } from "url";
import TypescriptGenerator from "./typescript.js";
import DockerGenerator from "./docker.js";
import BaseGenerator from "../classes/BaseGenerator.js";
import { error, info, log, magic, success, sep } from "../../utils/log.js";
import { ask, confirm } from "../../utils/ask.js";
import fs from "fs";
import chalk from "chalk";
import ora from "ora";
import header from "../../utils/init.js";
import AppGenerator from "../classes/AppGenerator.js";

export default class extends AppGenerator {
	
  // The name `constructor` is important here
	constructor(args: string | string[], opts: Generator.GeneratorOptions) {
		// Calling the super constructor is important so our generator is correctly set up
		super(args, opts, "express/base");
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

	protected async _askOptions() {
		console.log();
		// if (this.text) {
		// 	const prompts = [
		// 		{
		// 			type: "checkbox",
		// 			message: this.text.t("common.ask.options"),
		// 			name: "chosenOptions",
		// 			choices: [{ name: "Docker", value: "useDocker" }],
		// 		},
		// 	];

		// 	const props = await inquirer.prompt(prompts);
		// 	info(`${this.text.t("express.info.options")} ${props.chosenOptions.join(", ")}`);

		// 	if (props.chosenOptions.includes("useDocker")) {
		// 		this.options.useDockerCompose = await confirm(
		// 			"useDockerCompose",
		// 			this.text.t("common.ask.useDockerCompose"),
		// 			true
		// 		);
		// 	}

		// 	return props.chosenOptions;
		// }
    log("Asking options!!!")
		return [];
	}

  protected _loadOptionsGenerators(): void {
    log("LOADING!!!")
  }

}
