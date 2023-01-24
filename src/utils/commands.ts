import { ChildProcessWithoutNullStreams, spawn } from "child_process";
import commandExists from "command-exists";
import { ChildProcessTracker } from "./childs_processes.js";

export async function checkCommand(command: string) {
	try {
		const result = await commandExists(command);
		return true;
	} catch (error) {
		return false;
	}
}

export const spawnCommand = (
	commandPath: string,
	command: string,
	callbacks: ProcessCallbacks,
	exit?: boolean
) => {
	const process = spawn(`${command}`, [], {
		shell: true,
		stdio: "pipe",
		cwd: commandPath,
	});
	const tracker = ChildProcessTracker.getInstance();
	tracker.addChildProcess(process);
	handleChildEvent(process, callbacks, tracker, exit);
};

const handleChildEvent = (
	ls: ChildProcessWithoutNullStreams,
	callbacks: ProcessCallbacks,
	tracker: ChildProcessTracker,
	exit?: boolean
) => {
	ls.stdout?.on("data", (data: any) => {
		let arr = data
			.toString()
			.split("\n")
			.filter((el: string) => el != "");
		callbacks.stdout(arr);
	});

	ls.stderr?.on("data", (data: any) => {
		let arr = data
			.toString()
			.split("\n")
			.filter((el: string) => el != "");
		callbacks.stderr(arr);
	});

	ls.on("error", (error) => {
		let arr = [error.name, error.message, error.stack];
		callbacks.error({ ...error });
	});

	ls.on("close", (code: any) => {
		let arr = ["close"];
		callbacks.close(code, arr);
		tracker.removeChildProcess(ls);
		if (tracker.getChildProcesses().length === 0 && exit === undefined) {
			process.exit();
		}
		return;
	});
	ls.on("exit", (code: any) => {
		let arr = ["exit"];
		callbacks.exit(code, arr);
		return;
	});
};

export type ProcessCallbacks = {
	stdout: (data: string[]) => void;
	stderr: (data: string[]) => void;
	close: (code: number, data: string[]) => void;
	exit: (code: number, data: string[]) => void;
	error: (data: { name: string; message: string; stack?: string | undefined }) => void;
};
