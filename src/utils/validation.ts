function test(text: string, regex: RegExp) {
	return regex.test(text);
}

export function testAppName(appName: string) {
	return test(appName, regexes.appName);
}

export function testPort(port: string) {
	return test(port, regexes.port);
}

const regexes = {
	appName: /^[a-z][a-z0-9]*(?:[._-][a-z0-9]+)*$/,
	port: /^[0-9]{1,5}$/,
};
