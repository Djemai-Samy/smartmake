

import Generator from "yeoman-generator";
import { log } from "../utils/log";
import BaseGenerator from "./classes/BaseGenerator";


export default class extends BaseGenerator {
	
  // The name `constructor` is important here
	constructor(args: string | string[], opts: Generator.GeneratorOptions) {
		// Calling the super constructor is important so our generator is correctly set up
		super(args, opts, "base");
	}

  async prompting() {
  }
  async writing() {

	}
	async install() {
		
	}
	async end() {
		
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
