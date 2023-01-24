import meow, { AnyFlags } from "meow";
import meowHelp from "cli-meow-help";
import chalk from "chalk";


const flags = {
	language: {
		type: `string`,
		alias: `l`,
		desc: `Choose your language: [fr, en] -> ${chalk.green("en with --yes")}`,
	},
	yes: {
		type: `boolean`,
		alias: `y`,
		desc: `Apply default values.`,
	},
  docker: {
		type: `boolean`,
		alias: `d`,
		desc: `Launch apps in docker -> ${chalk.green('default with --yes')}`,
	},
	noDocker: {
		type: `boolean`,
		desc: `Don't launch apps in docker.`,
	},
  all: {
		type: `boolean`,
		desc: `Launch all services.`,
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
