var Generator = require('yeoman-generator');

module.exports = class extends Generator {
	constructor(args, opts) {
		super(args, opts);

		// Next, add your custom code
		this.option('babel'); // This method adds support for a `--babel` flag
	}

	async prompting() {
		const answers = await this.prompt([
			{
				type: 'input',
				name: 'name',
				message: 'Your NextJS app name:',
				default: this.appname // Default to current folder name
			},
			{
				type: 'confirm',
				name: 'cool',
				message: 'Would you like to enable the Cool feature?'
			}
		]);
	}
	writing() {
		console.log('dets', this.destinationPath('.'));
		this.fs.copyTpl(
			this.templatePath('index.ejs'),
			this.destinationPath('./index.js'),
			{ title: 'test' }
		);
	}
};
