import meow from "meow";
import meowHelp from "cli-meow-help";

type AnyFlags = Record<string, any>;

const flags = {
	// clear: {
	// 	type: `boolean`,
	// 	default: true,
	// 	alias: `c`,
	// 	desc: `Clear the console`,
	// },
	// noClear: {
	// 	type: `boolean`,
	// 	default: false,
	// 	desc: `Don't clear the console`,
	// },
	debug: {
		type: `boolean`,
		default: false,
		alias: `d`,
		desc: `Print debug info`,
	},
	version: {
		type: `boolean`,
		alias: `v`,
		desc: `Print CLI version`,
	},
	language: {
		type: `string`,
		alias: `l`,
		desc: `Choose your language: [fr, en]`,
	},
	useTypescript: {
		type: "boolean",
		alias: "t",
		desc: "Use typescript",
	},
	useJavascript: {
		type: "boolean",
		alias: "j",
		desc: "Use javascript",
	},
	useYarn: {
		type: `boolean`,
		desc: `Use Yarn`,
	},
	useNpm: {
		type: `boolean`,
		desc: `Use npm`,
	},
	install: {
		type: `boolean`,
		alias: `i`,
		desc: `Install dependencies`,
	},
	noInstall: {
		type: `boolean`,
		desc: `Don't install dependencies`,
	},
	useDocker: {
		type: `boolean`,
		alias: `d`,
		desc: `Use docker for the project`,
	},
	noDocker: {
		type: `boolean`,
		desc: `Don't use docker for the project`,
	},
	useDockerCompose: {
		type: `boolean`,
		desc: `Use docker compose for the project`,
	},
	noDockerCompose: {
		type: `boolean`,
		desc: `Don't use docker compose for the project`,
	},
} as AnyFlags;

const commands = {
	help: { desc: `Print help info` },
	// express: { desc: "Creating an ExpressJS project" },
	// react: { desc: "Creating a ReactJS project" },
};

const helpText = meowHelp({
	name: `smartmake`,
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

export default meow(helpText, {
	inferType: true,
	importMeta: import.meta,
	description: "true",
	hardRejection: false,
	flags: flags,
});

export type Options = {
	lang: string;
	useTypescript: boolean;
	useJavascript: boolean;
	useYarn: boolean;
	useNpm: boolean;
	install: boolean;
	noInstall: boolean;
	useDocker: boolean;
	noDocker: boolean;
	useDockerCompose: boolean;
	noDockerCompose: boolean;
};

export type GeneratorOptions = {
	useTypescript: boolean | undefined;
	useYarn: boolean | undefined;
	install: boolean | undefined;
	useDocker: boolean | undefined;
	useDockerCompose: boolean | undefined;
};
