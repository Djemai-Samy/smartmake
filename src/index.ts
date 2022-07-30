#!/usr/bin/env node

/**
 * smart-maker
 * A flexible app boilerplate generator
 *
 * @author Djemai Samy <djemai-samy>
 */

import init from './utils/init';
import cli from './utils/cli';
import log from './utils/log';

const input = cli.input;
const flags = cli.flags;
const { clear, debug } = flags;

(async () => {
	init({ clear });
	input.includes(`help`) && cli.showHelp(0);

	input.includes(`test`) && console.log('test');

	debug && log(flags);
})();
