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
import cli, { Options} from "./cli.js";
import { ChildProcessTracker } from "../../utils/childs_processes.js";
const input = cli.input.slice(1);
const flags = cli.flags;

export const runCreate = async () => {

	const tracker = ChildProcessTracker.getInstance();
	process.on("SIGINT", (a) => {
		tracker.killAllChilds(0);
	});

	input.includes(`help`) && cli.showHelp(0);

	const __filename = fileURLToPath(import.meta.url);
	const __dirname = path.resolve(path.dirname(__filename), `..`, `..`, `generators`, "apps");
	
  var env = yeoman.createEnv();
	
  env.register(__dirname, `project`);

	env.run([`project`], {
		skipInstall: true,
		flags,
    input
	});
};
