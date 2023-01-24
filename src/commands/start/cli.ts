import meow, { AnyFlags } from "meow";
import meowHelp from "cli-meow-help";
import chalk from "chalk";


const flags = {
	version: {
		type: `boolean`,
		alias: `v`,
		desc: `Print CLI version`,
	},
	language: {
		type: `string`,
		alias: `l`,
		desc: `Choose your language: [fr, en] -> ${chalk.green("en with --yes")}`,
	},
	yes: {
		type: `boolean`,
		alias: `y`,
		desc: `Apply -> ${chalk.green(
			"--language en --useTypescript --useYarn --install --docker"
		)}.`,
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
  all: {
		type: `boolean`,
		desc: `All services`,
	},
} as AnyFlags;

const commands = {
	help: { desc: `Print help info` },
};

const helpText = meowHelp({
	name: `smartmake start`,
	examples: [
		{
			command: ``,
		},
	],
	flags,
	commands,
});


export default meow(`${helpText}`, {
	inferType: true,
	importMeta: import.meta,
	description: "Start quickly and easily multiple apps in one process.",
	hardRejection: false,
	flags: flags,
});

export type ManagerFlags = {
	yes: boolean;
	language: string;
  docker: boolean | undefined;
  noDocker: boolean| undefined;
  all:boolean | undefined;
};
