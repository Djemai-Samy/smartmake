#!/usr/bin/env node

/**
 * smart-maker
 * A flexible app boilerplate generator
 *
 * @author Djemai Samy <djemai-samy>
 */
import path from "path";
import yeoman from "yeoman-environment";
import { fileURLToPath } from "url";
import init from "../../utils/init.js";
import cli, { Options, GeneratorOptions } from "./cli.js";
import { log } from "../../utils/log.js";
import { ChildProcessTracker } from "../../utils/childs_processes.js";
const input = cli.input;
const flags = cli.flags;
const { clear, debug } = flags;

export const runCreate = async () => {
	init({});
	const tracker = ChildProcessTracker.getInstance();
	process.on("SIGINT", (a) => {
		tracker.killAllChilds(0);
	});

	input.includes(`help`) && cli.showHelp(0);

	//  log(flags);

	const options: Options = {
		lang: flags.language,
		useTypescript: flags.useTypescript,
		useJavascript: flags.useJavascript,
		useYarn: flags.useYarn,
		useNpm: flags.useNpm,
		install: flags.install,
		noInstall: flags.noInstall,
		useDocker: flags.docker,
		noDocker: flags.noDocker,
	} as Options;

	const generatorOptions: GeneratorOptions = {
		useTypescript: undefined,
		useYarn: undefined,
		install: undefined,
		useDocker: undefined,
	};

	const __filename = fileURLToPath(import.meta.url);
	const __dirname = path.resolve(path.dirname(__filename), `..`, `..`, `generators`, "apps");
	var env = yeoman.createEnv();
	env.register(__dirname, `project`);

	env.run([`project`], {
		skipInstall: true,
		flags,
	});
};
