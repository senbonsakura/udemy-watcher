const execSync = require('child_process').execSync
const exec = require('child_process').exec
const arg = process.argv[2]; // Default value `dv` if no args provided via CLI.
exec('npm run start-client', {stdio:[0, 1, 2]});

const serverOutput = execSync(`npm run start-server "${arg}"`, {stdio:[0, 1, 2]},(error)=>console.log(error)).toString();
console.log(serverOutput)



