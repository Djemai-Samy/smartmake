#!/usr/bin/env node
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
import cli from "./utils/cli.js";
import { log } from "./utils/log.js";
import { ChildProcessTracker } from "./utils/childs_processes.js";
const input = cli.input;
const flags = cli.flags;
const { clear, debug } = flags;
(() => __awaiter(void 0, void 0, void 0, function* () {
    init({});
    const tracker = ChildProcessTracker.getInstance();
    process.on("SIGINT", (a) => {
        tracker.killAllChilds(0);
    });
    input.includes(`help`) && cli.showHelp(0);
    debug && log(flags);
    const options = {
        lang: flags.language,
        useTypescript: flags.useTypescript,
        useJavascript: flags.useJavascript,
        useYarn: flags.useYarn,
        useNpm: flags.useNpm,
        install: flags.install,
        noInstall: flags.noInstall,
        useDocker: flags.useDocker,
        noDocker: flags.noDocker,
        useDockerCompose: flags.useDockerCompose,
        noDockerCompose: flags.noDockerCompose,
    };
    const generatorOptions = {
        useTypescript: undefined,
        useYarn: undefined,
        install: undefined,
        useDocker: undefined,
        useDockerCompose: undefined,
    };
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.resolve(path.dirname(__filename), `generators`, "apps");
    var env = yeoman.createEnv();
    env.register(__dirname, `project`);
    env.run([`project`], {
        skipInstall: true,
        flags,
    });
}))();
