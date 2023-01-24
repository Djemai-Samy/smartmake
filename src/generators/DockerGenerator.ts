import Generator from "yeoman-generator";
import path from "path";
import BaseGenerator from "./BaseGenerator.js";
import { lang } from "../translate.js";
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
	async end() {}
}
