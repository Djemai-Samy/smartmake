#!/usr/bin/env node

/**
 * smart-maker
 * A flexible app boilerplate generator
 *
 * @author Djemai Samy <djemai-samy>
 */
import inquirer from 'inquirer';
import { lang } from './translate.js';
import { spawn } from 'child_process';
import path from 'path';

import yeoman from 'yeoman-environment';
import { fileURLToPath } from 'url';
import commandExists from 'command-exists';
(async () => {
	// invoked without a callback, it returns a promise
	let isYarn = false;
	try {
		const yarnExist = commandExists('yarn');
		const useYarn = await inquirer.prompt([
			{
				type: 'confirm',
				name: 'isYarn',
				message: 'use Yarn?',
				default: false
			}
		]);
		isYarn = useYarn.isYarn;
	} catch (err) {
		console.log('Using npm...');
	}

	const language: { lng: string } = await inquirer.prompt([
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
	const text = await lang.getInstance(chosenLang);
	const appChoice = await inquirer.prompt([
		{
			type: 'list',
			name: 'app',
			choices: ['Express', 'React', 'NextJS', 'Flask'],
			message: text.t('common.ask.projectName')
		}
	]);

	const installDeps = await inquirer.prompt([
		{
			type: 'confirm',
			name: 'installDeps',
			message: text.t('common.ask.installDeps'),
			default: true
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
	const __dirname = path.resolve(
		path.dirname(__filename),
		'..',
		`generator-${app}`,
		'generators',
		'app'
	);
	var env = yeoman.createEnv();
	env.register(__dirname, `${app}:app`);

	env.run([`${app}:app`, chosenLang], {
		skipInstall: true,
		installDeps: installDeps.installDeps,
		lang: chosenLang,
		isYarn
	});
})();

// let yo = spawn(`npx yo ./generator-${app}`, [], {
// 	shell: true,
// 	stdio: 'inherit',
// 	cwd: process.cwd()
// });

// yo.on('exit', function (code) {
// 	console.log('child process exited with code ' + code);
// });
