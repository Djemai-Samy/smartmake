import Generator from "yeoman-generator";
import path from "path";
import fs from "fs";
import BaseGenerator from "./BaseGenerator.js";
import { lang } from "../translate.js";
export default class extends BaseGenerator {
	// The name `constructor` is important here
	constructor(args: string | string[], opts: Generator.GeneratorOptions) {
		// Calling the super constructor is important so our generator is correctly set up
		super(args, opts, path.join(opts.template, "typescript"));

		this.appName = this.options.appName;
	}

	async prompting() {
		const text = await lang.getInstance(this.options.lang);
	}
	async writing() {
		this.fs.copy(`${this.templateFolderPath}/**/[!^_]*.*`, `${this._getAppPath()}`);
	}
	async install() {
		this.spinner.start();
		this._search(this._getAppPath());
		this.spinner.stop();
	}
	async end() {}

	private _changeExtension = (file: string) => {
		const newFile = file.replace(
			/\.jsx?$/,
			path.extname(file) === ".js" ? ".ts" : ".tsx"
		); // Replace the js extension with ts

		fs.renameSync(file, newFile); // Rename the file

		this.spinner.text = `${file.split(path.sep).pop()} to ${newFile
			.split(path.sep)
			.pop()}`;
	};

	private _search = (dir: string) => {
		if (dir.includes("node_modules")) {
			return;
		}
		const files = fs.readdirSync(dir); // Get a list of all files in the directory
		files.forEach((file) => {
			const filePath = path.join(dir, file); // Construct the full file path
			const stats = fs.statSync(filePath); // Get the file stats
			if (stats.isFile()) {
				// If the file is a regular file
				if (
					(path.extname(file) === ".js" || path.extname(file) === ".jsx") &&
					file !== "webpack.config.js"
				) {
					// If the file has a .js extension
					this._changeExtension(filePath); // Change the extension to .ts
				}
			} else if (stats.isDirectory()) {
				// If the file is a directory
				this._search(filePath); // Search the directory for more files
			}
		});
	};
}
