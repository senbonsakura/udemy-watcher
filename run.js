const execSync = require('child_process').exec;

const arg = process.argv[2]; // Default value `dv` if no args provided via CLI.

execSync('npm run start-server ' + arg, {stdio:[0, 1, 2]});
execSync('npm run start-client', {stdio:[0, 1, 2]});


