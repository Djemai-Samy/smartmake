import Generator from 'yeoman-generator';
import fse from 'fs-extra';
import { lang } from '../../../bin/translate.js';
import path from 'path';
import { spawn } from 'child_process';
import inquirer from 'inquirer';
export default class extends Generator {
	// The name `constructor` is important here
	constructor(args, opts) {
		// Calling the super constructor is important so our generator is correctly set up
		super(args, opts);
		// Next, add your custom code
		this.option('babel'); // This method adds support for a `--babel` flag
		if (this.options.isYarn) {
			this.env.options.nodePackegeManager = 'yarn';
		}
	}

	async prompting() {
		// Have Yeoman greet the user.
		const text = await lang.getInstance(this.options.lang);
		const prompts = [
			{
				type: 'input',
				name: 'projectName',
				message: text.t('common.ask.appName'),
				default: 'app' // Default to current folder name
			},
			{
				type: 'checkbox',
				message: text.t('common.ask.options'),
				name: 'chosenOptions',
				choices: [
					{ name: 'Docker', value: 'docker' },
					{ name: 'Docker compose', value: 'dockerCompose' }
				] // Default to current folder name
			}
		];

		const props = await this.prompt(prompts);
		console.log('props', props);
		// To access props later use this.props.someAnswer;
		this.options = { ...this.options, ...props };
	}
	async writing() {
		const text = await lang.getInstance(this.options.lang);

		const tmpPath = path.resolve(this.templatePath());
		const destPath = path.normalize(this.destinationPath());
		this.log('PPPATTHH ', destPath);
		const appPath = `${destPath}/${this.options.projectName}`;

		//Create app folder
		fse.mkdir(`${appPath}`);

		//Create src folder
		const srcPath = `${appPath}/src`;

		this.fs.copy(`${tmpPath}/**/[!^_]*.*`, `${appPath}/`);

		//Files with templeting:

		this.fs.copyTpl(`${tmpPath}/_package.json`, `${appPath}/package.json`, {
			projectName: this.options.projectName,
			text: text,
			packageManager: this.options.isYarn ? 'yarn' : 'npm',
			destPath: (appPath + '/src')
				.replace(/[\\/]+/g, '/')
				.replace(/^([a-zA-Z]+:|\.\/)/, '')
		});

		this.fs.copyTpl(`${tmpPath}/_README.md`, `${appPath}/README.md`, {
			projectName: this.options.projectName,
			text: text
		});

		this.fs.copyTpl(`${tmpPath}/src/_index.ts`, `${srcPath}/index.ts`, {
			projectName: this.options.projectName,
			text: text
		});

		//OPTIONS
		if (this.options.chosenOptions.includes('docker')) {
			console.log('Dockerizing');
			this.fs.copyTpl(`${tmpPath}/_Dockerfile`, `${appPath}/Dockerfile`, {
				packageManager: this.options.isYarn ? 'yarn' : 'npm',
				text: text
			});
			this.fs.copyTpl(
				`${tmpPath}/_dockerignore`,
				`${appPath}/.dockerignore`,
				{
					packageManager: this.options.isYarn ? 'yarn' : 'npm',
					text: text
				}
			);
		}

		//Change workdir for deps installations
		const destinationRoot = this.destinationRoot(this.options.projectName);
		this.env.cwd = destinationRoot;
	}
	async install() {
		if (!this.options.installDeps) {
			return;
		}
		await this.spawnCommandSync(
			`cd ${path.join(this.destinationPath(), '/')} && ${
				this.options.isYarn ? 'yarn' : 'npm'
			} install`,
			[],
			{
				shell: true,
				stdio: 'inherit'
				// cwd: process.cwd()
			}
		);
	}
	async end() {
		const text = await lang.getInstance(this.options.lang);
		if (!this.options.installDeps) {
			return;
		}

		const prompts = [
			{
				type: 'confirm',
				name: 'start',
				message: text.t('express.ask.startServer'),
				default: true
			}
		];

		const props = await this.prompt(prompts);

		if (props.start) {
			if (this.options.chosenOptions.includes('dockerCompose')) {
				console.log('Dockerizing');
				spawn(
					`cd ${path.join(this.destinationPath(), '/')} && ${
						this.options.isYarn ? 'yarn' : 'npm'
					} docker:dev`,
					[],
					{
						shell: true,
						stdio: 'inherit'
						// cwd: process.cwd()
					}
				);
				return;
			}
			spawn(
				`cd ${path.join(this.destinationPath(), '/')} && ${
					this.options.isYarn ? 'yarn' : 'npm'
				} run dev`,
				[],
				{
					shell: true,
					stdio: 'inherit'
					// cwd: process.cwd()
				}
			);
		}
	}
}
