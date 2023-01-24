import meow from "meow";
import meowHelp from "cli-meow-help";
import chalk from "chalk";

type AnyFlags = Record<string, any>;

const flags = {
	version: {
		type: `boolean`,
		alias: `v`,
		desc: `Print CLI version`,
	},
	language: {
		type: `string`,
		alias: `l`,
		desc: `Choose your language: [fr, en] -> ${chalk.green('en with --yes')}`,
	},
	useTypescript: {
		type: "boolean",
		alias: "t",
		desc: `Use typescript -> ${chalk.green('default with --yes')}`,
	},
	useJavascript: {
		type: "boolean",
		alias: "j",
		desc: "Use javascript",
	},
	useYarn: {
		type: `boolean`,
		desc: `Use Yarn -> ${chalk.green('default with --yes')}`,
	},
	useNpm: {
		type: `boolean`,
		desc: `Use npm`,
	},
	install: {
		type: `boolean`,
		alias: `i`,
		desc: `Install dependencies -> ${chalk.green('default with --yes')}`,
	},
	noInstall: {
		type: `boolean`,
		desc: `Don't install dependencies`,
	},
	docker: {
		type: `boolean`,
		alias: `d`,
		desc: `Use docker for the project -> ${chalk.green('default with --yes')}`,
	},
	noDocker: {
		type: `boolean`,
		desc: `Don't use docker for the project`,
	},
  yes: {
		type: `boolean`,
		alias: `y`,
		desc: `Apply -> ${chalk.green('--language en --useTypescript --useYarn --install --docker')}.`,
	},
} as AnyFlags;

const commands = {
	help: { desc: `Print help info` },
	express: { desc: "Create an ExpressJS project" },
	react: { desc: "Create a ReactJS project" },
};

const helpText = meowHelp({
	name: `smartmake create`,
	examples: [
		{
			command: ``,
		},
		{
			command: ``,
			flags: ["useTypescript", "docker"],
		},
		{
			command: `react`,
			flags: ["useYarn", "install"],
		},
		{
			command: `react express`,
			flags: ["language fr","useTypescript", "useYarn", "install", "docker"],
		},
	],
	flags,
	commands,
});

const options = {
	inferType: true,
	importMeta: import.meta,
	description: false,
	hardRejection: false,
	flags,
};

export default meow(`${helpText}`, {
	inferType: true,
	importMeta: import.meta,
	description: "Create quickly and easily multiple apps.",
	hardRejection: false,
	flags: flags,
});

export type Options = {
  yes:boolean;
	lang: string;
	useTypescript: boolean;
	useJavascript: boolean;
	useYarn: boolean;
	useNpm: boolean;
	install: boolean;
	noInstall: boolean;
	useDocker: boolean;
	noDocker: boolean;
};

export type GeneratorOptions = {
	useTypescript: boolean | undefined;
	useYarn: boolean | undefined;
	install: boolean | undefined;
	useDocker: boolean | undefined;
};
