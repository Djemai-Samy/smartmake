#!/usr/bin/env node

/**
 * smartmaje start
 * Start quickly et easily your services in one process.
 *
 * @author Djemai Samy <djemai-samy>
 */
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import init from "../../utils/init.js";
import cli, { ManagerFlags } from "./cli.js";
import { error, log } from "../../utils/log.js";
import { ChildProcessTracker } from "../../utils/childs_processes.js";
import ProjectManager from "./managers/ProjectManage.js";
import { AnyFlags } from "meow";
import { smartmakeSettingsExist } from "../../utils/filesystem.js";
import { lang } from "../../translate.js";

const inputs = cli.input.slice(1);
const flags = cli.flags as ManagerFlags;


function getSettings() {
	// Read the contents of the file
	let jsonString = fs.readFileSync("smartmake.json", "utf8");

	// Convert JSON string to a JavaScript object
	return JSON.parse(jsonString);
}

export const runStart = async () => {
	inputs.includes(`help`) && cli.showHelp(0);

	if (!smartmakeSettingsExist()) {
		error("Smartmake settings not found! Are you in the correct folder?");
		return;
	}

	const settings = getSettings();

	const manager = new ProjectManager(settings, { flags, inputs });

  const tracker = ChildProcessTracker.getInstance();
	process.on("SIGINT", (a) => {
		tracker.killAllChilds(0);
	});

	await manager.run();
	// const text = await lang.getInstance(this.options.lang);

};
