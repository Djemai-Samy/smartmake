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
import inquirer from "inquirer";
import { lang } from "./translate.js";
import path from "path";
import yeoman from "yeoman-environment";
import { fileURLToPath } from "url";
import commandExists from "command-exists";
import init from "./utils/init.js";
import cli from "./utils/cli.js";
import { log, info, error } from "./utils/log.js";
import { ask, choices, confirm } from "./utils/ask.js";
import fs from "fs";
import fse from "fs-extra";
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
    const yarnExist = yield checkCommand("yarn");
    const dockerExist = yield checkCommand("docker");
    const dockerComposeExist = yield checkCommand("docker-compose");
    options.useTypescript ? (generatorOptions.useTypescript = true) : null;
    options.useJavascript ? (generatorOptions.useTypescript = false) : null;
    //If yarn exist, check flags to verify what manager he chose, undefined if he didnt
    if (yarnExist) {
        options.useYarn ? (generatorOptions.useYarn = true) : null;
        options.useNpm ? (generatorOptions.useYarn = false) : null;
    }
    else {
        generatorOptions.useYarn = false;
    }
    options.install ? (generatorOptions.install = true) : null;
    options.noInstall ? (generatorOptions.install = false) : null;
    //If docker exist, check flags to verify id we can use it, undefined if he didnt
    if (dockerExist) {
        options.useDocker ? (generatorOptions.useDocker = true) : null;
        options.noDocker ? (generatorOptions.useDocker = false) : null;
        if (dockerComposeExist) {
            options.useDockerCompose ? (generatorOptions.useDockerCompose = true) : null;
            options.noDockerCompose ? (generatorOptions.useDockerCompose = false) : null;
        }
        else {
            generatorOptions.useDockerCompose = false;
        }
    }
    else {
        generatorOptions.useDocker = false;
        generatorOptions.useDockerCompose = false;
    }
    //language
    if (!options.lang || (options.lang !== "en" && options.lang !== "fr")) {
        const language = yield inquirer.prompt([
            {
                type: "list",
                name: "lang",
                choices: ["Français", "English"],
                message: "Choose your language...",
            },
        ]);
        switch (language.lang) {
            case "Français":
                options.lang = "fr";
                break;
            default:
                options.lang = "en";
                break;
        }
    }
    const text = yield lang.getInstance(options.lang);
    //ProjectName
    let projectName = yield ask("projectName", text.t("common.ask.projectName"), "app");
    while (checkIfFolderExist(projectName) || !checkIfNameValid(projectName)) {
        checkIfFolderExist(projectName) ? error(text.t("common.ask.appNameExists")) : null;
        !checkIfNameValid(projectName) ? error(text.t("common.ask.nameInvalid")) : null;
        projectName = yield ask("projectName", text.t("common.ask.projectName"), "app");
    }
    fse.mkdir(`${projectName}`);
    //App
    let template = "";
    let templateName = "";
    if (input.includes("react"))
        (template = "react"), (templateName = "ReactJS");
    else if (input.includes("express"))
        (template = "express"), (templateName = "ExpressJS");
    else {
        templateName = yield choices("app", text.t("common.ask.templateName"), [
            "ExpressJS",
            "ReactJS",
        ]);
        switch (templateName) {
            case "ReactJS":
                template = "react";
                break;
            case "ExpressJS":
                template = "express";
                break;
        }
    }
    info(`${text.t("common.info.projectName")} ${templateName} app!`);
    //ask for typescript if not specified
    if (generatorOptions.useTypescript === undefined) {
        try {
            generatorOptions.useTypescript = yield confirm("useTypescript", text.t("common.ask.useTypescript"), true);
        }
        catch (err) {
            console.log(err);
        }
    }
    //package manager
    if (generatorOptions.useYarn === undefined) {
        try {
            generatorOptions.useYarn = yield confirm("useYarn", text.t("common.ask.packageManager"), true);
        }
        catch (err) {
            console.log(err);
        }
    }
    //Install deps
    if (generatorOptions.install === undefined) {
        try {
            generatorOptions.install = yield confirm("install", text.t("common.ask.installDeps"), true);
        }
        catch (err) {
            console.log(err);
        }
    }
    //Docker
    if (generatorOptions.useDocker === undefined) {
        try {
            generatorOptions.useDocker = yield confirm("useDocker", text.t("common.ask.useDocker"), true);
        }
        catch (err) {
            console.log(err);
        }
    }
    //Docker compose
    if (generatorOptions.useDocker === true &&
        generatorOptions.useDockerCompose === undefined) {
        try {
            generatorOptions.useDockerCompose = yield confirm("useDockerCompose", text.t("common.ask.useDockerCompose"), true);
        }
        catch (err) {
            console.log(err);
        }
    }
    if (generatorOptions.useYarn === true)
        info(text.t("common.info.usingYarn"));
    if (generatorOptions.useYarn === false)
        info(text.t("common.info.usingNpm"));
    if (generatorOptions.install === true)
        info(text.t("common.info.installDeps"));
    if (generatorOptions.useTypescript === true)
        info(text.t("common.info.usingTypescript"));
    if (generatorOptions.useTypescript === false)
        info(text.t("common.info.usingJavascript"));
    if (generatorOptions.useDocker === true)
        info(text.t("common.info.usingDocker"));
    if (generatorOptions.useDockerCompose === true)
        info(text.t("common.info.usingDockerCompose"));
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.resolve(path.dirname(__filename), `generators`, `${template}`);
    var env = yeoman.createEnv();
    env.register(__dirname, `${template}:app`);
    env.run([`${template}:app`], {
        projectName: projectName,
        skipInstall: true,
        install: generatorOptions.install,
        lang: options.lang,
        useYarn: generatorOptions.useYarn,
        useTypescript: generatorOptions.useTypescript,
        useDocker: generatorOptions.useDocker,
        useDockerCompose: generatorOptions.useDockerCompose,
    });
}))();
function checkCommand(command) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const result = yield commandExists(command);
            return true;
        }
        catch (error) {
            return false;
        }
    });
}
function checkIfFolderExist(name) {
    const destPath = process.cwd();
    return fs.existsSync(path.join(destPath, name));
}
function checkIfNameValid(name) {
    return /^[a-z][a-z0-9]*(?:[._-][a-z0-9]+)*$/.test(name);
}
