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
import inquirer from 'inquirer';
import { lang } from './translate.js';
import path from 'path';
import yeoman from 'yeoman-environment';
import { fileURLToPath } from 'url';
import commandExists from 'command-exists';
(() => __awaiter(void 0, void 0, void 0, function* () {
    // invoked without a callback, it returns a promise
    let isYarn = false;
    try {
        const yarnExist = commandExists('yarn');
        console.log('exist');
        const useYarn = yield inquirer.prompt([
            {
                type: 'confirm',
                name: 'isYarn',
                message: 'use Yarn?',
                default: false
            }
        ]);
        console.log(useYarn);
        isYarn = useYarn.isYarn;
    }
    catch (err) {
        console.log('not exist');
    }
    const language = yield inquirer.prompt([
        {
            type: 'list',
            name: 'lng',
            choices: ['Francais', 'English'],
            message: 'Choose your language?'
        }
    ]);
    let chosenLang = '';
    switch (language.lng) {
        case 'Francais':
            chosenLang = 'fr';
            break;
        default:
            chosenLang = 'en';
            break;
    }
    const text = yield lang.getInstance(chosenLang);
    const appChoice = yield inquirer.prompt([
        {
            type: 'list',
            name: 'app',
            choices: ['Express', 'React', 'NextJS', 'Flask'],
            message: text.t('common.ask.projectName')
        }
    ]);
    const installDeps = yield inquirer.prompt([
        {
            type: 'confirm',
            name: 'installDeps',
            message: text.t('common.ask.installDeps'),
            default: false
        }
    ]);
    let app = '';
    switch (appChoice.app) {
        case 'NextJS':
            app = 'next';
            break;
        case 'Flask':
            app = 'flask';
            break;
        case 'Express':
            app = 'express';
            break;
    }
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.resolve(path.dirname(__filename), '..', `generator-${app}`, 'generators', 'app');
    var env = yeoman.createEnv();
    env.register(__dirname, `${app}:app`);
    env.run([`${app}:app`, chosenLang], {
        skipInstall: true,
        installDeps: installDeps.installDeps,
        lang: chosenLang,
        isYarn
    });
}))();
// let yo = spawn(`npx yo ./generator-${app}`, [], {
// 	shell: true,
// 	stdio: 'inherit',
// 	cwd: process.cwd()
// });
// yo.on('exit', function (code) {
// 	console.log('child process exited with code ' + code);
// });
