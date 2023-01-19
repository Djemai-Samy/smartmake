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
import cli from "./utils/cli.js";
import { runCreate } from "./commands/create/index.js";
const input = cli.input;
const flags = cli.flags;
const { clear, debug } = flags;
(() => __awaiter(void 0, void 0, void 0, function* () {
    input.includes(`help`) && cli.showHelp(0);
    yield runCreate();
    // const options: Options = {
    // 	lang: flags.language,
    // 	useTypescript: flags.useTypescript,
    // 	useJavascript: flags.useJavascript,
    // 	useYarn: flags.useYarn,
    // 	useNpm: flags.useNpm,
    // 	install: flags.install,
    // 	noInstall: flags.noInstall,
    // 	useDocker: flags.docker,
    // 	noDocker: flags.noDocker,
    // } as Options;
    // const generatorOptions: GeneratorOptions = {
    // 	useTypescript: undefined,
    // 	useYarn: undefined,
    // 	install: undefined,
    // 	useDocker: undefined,
    // };
    // const __filename = fileURLToPath(import.meta.url);
    // const __dirname = path.resolve(path.dirname(__filename), `generators`,"apps");
    // var env = yeoman.createEnv();
    // env.register(__dirname, `project`);
    // env.run([`project`], {
    // 	skipInstall: true,
    // 	flags,
    // });
}))();
