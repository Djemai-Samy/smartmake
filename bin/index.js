#!/usr/bin/env node
/**
 * smart-maker
 * A flexible app boilerplate generator
 *
 * @author Djemai Samy <djemai-samy>
 */
import inquirer from 'inquirer';
import path from 'path';
import { fileURLToPath } from 'url';
import yeoman from 'yeoman-environment';
(async () => {
    const result = await inquirer.prompt([
        { type: 'list', name: 'app', choices: ['React', 'NextJS', 'Flask'] }
    ]);
    let app = '';
    switch (result.app) {
        case 'NextJS':
            app = 'next';
            break;
        case 'Flask':
            app = 'flask';
            break;
    }
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.resolve(path.dirname(__filename), '..', 'generator-next', 'generators', 'app');
    var env = yeoman.createEnv();
    env.register(__dirname, 'next:app');
    env.run('next:app');
})();
// let yo = spawn(`npx yo ./generator-${app}`, [], {
// 	shell: true,
// 	stdio: 'inherit',
// 	cwd: process.cwd()
// });
// yo.on('exit', function (code) {
// 	console.log('child process exited with code ' + code);
// });
