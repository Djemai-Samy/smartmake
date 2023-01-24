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
import init from "./utils/init.js";
import cli, { Options, GeneratorOptions } from "./utils/cli.js";
import { log } from "./utils/log.js";
import { ChildProcessTracker } from "./utils/childs_processes.js";
import { runCreate } from "./commands/create/index.js";
import { runStart } from "./commands/start/index.js";
const input = cli.input;
const flags = cli.flags;
const { clear, debug } = flags;

(async () => {
	init({});
	input.includes("create") && (await runCreate());
  input.includes("start") && (await runStart());

	input.includes(`help`) && cli.showHelp(0);
})();
