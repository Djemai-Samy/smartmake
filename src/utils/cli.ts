import meow from "meow";
import meowHelp from "cli-meow-help";

type AnyFlags = Record<string, any>;

const flags = {
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
} as AnyFlags;

const commands = {
	help: { desc: `Print help info` },
	create: { desc: `Create apps.` },
	start: { desc: `Start your apps.` },
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
	description: "You can create apps and choose your options",
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
};

export type GeneratorOptions = {
	useTypescript: boolean | undefined;
	useYarn: boolean | undefined;
	install: boolean | undefined;
	useDocker: boolean | undefined;
};
