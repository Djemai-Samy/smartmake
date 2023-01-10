import commandExists from "command-exists";

export async function checkCommand(command: string) {
	try {
		const result = await commandExists(command);
		return true;
	} catch (error) {
		return false;
	}
}
