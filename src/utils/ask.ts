import inquirer from "inquirer";
import { lang, languages } from "../translate.js";
import { error } from "./log.js";

// INQUIRER
export const confirm = async (message: string, defaultValue: boolean) => {
	let resp = await inquirer.prompt([
		{
			type: "confirm",
			name: "confirm",
			message: message,
			default: defaultValue,
		},
	]);
	console.log();
	return resp.confirm;
};

export const proceed = async (defaultValue: boolean) => {
	const text = await lang.getInstance();
	return await confirm(text.t("common.ask.proceed"), defaultValue);
};

export const checkbox = async (
	message: string,
	listchoices: Array<{ name: string; value: string; checked: boolean }>,
	selected: Array<string>
) => {
	const resp = await inquirer.prompt([
		{
			type: "checkbox",
			name: "list",
			choices: listchoices,
			message: message,
			default: selected,
		},
	]);
	console.log();
	return resp.list;
};

export const ask = async (name: string, message: string, defaultValue: string) => {

	const resp = await inquirer.prompt([
		{
			type: "input",
			name: name,
			message: message,
			default: defaultValue,
		},
	]);
  console.log();
	return resp[name];
};

export const list = async (
	message: string,
	choices: Array<{ name: string; value: string }>
) => {
	const resp = await inquirer.prompt([
		{
			type: "list",
			name: "choices",
			choices,
			message,
		},
	]);

	return resp.choices;
};

// COMMON QUESTIONS

export const askLanguage = async () => {
	return await list("Choose your language...", languages);
};

export const askTask = async () => {
	const text = await lang.getInstance();
	return await list(text.t("start.common.ask.task"), [
		{ name: "Development", value: "dev" },
		{ name: "Build", value: "build" },
		{ name: "Production", value: "prod" },
	]);
};

export const askDocker = async () => {
	const text = await lang.getInstance();
	return confirm(text.t("common.ask.useDocker"), true);
};

export const askApps = async (
	listchoices: Array<{ name: string; value: string; checked: boolean }>
) => {
	const text = await lang.getInstance();
	let chosenServices = [];

	while (chosenServices.length === 0) {
		chosenServices = await checkbox(text.t("start.common.ask.services"), listchoices, []);
		if (chosenServices.length === 0) error(text.t("start.common.error.noService"));
	}

	return chosenServices;
};
