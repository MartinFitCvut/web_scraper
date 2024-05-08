const { exec } = require('child_process');

// Funkcia na spustenie npm install v danom adresári
function runNpmInstall(directory, callback) {
    exec('npm install', { cwd: directory }, (error, stdout, stderr) => {
        if (error) {
            console.error(`Chyba pri inštalácii v ${directory}: ${error}`);
            return;
        }
        console.log(`Inštalácia v ${directory} dokončená.`);
        callback(); 
    });
    
}

function runSetupMongo() {
    console.log('Spúšťam setupmongo.js...');
    exec('cd backend && node ./src/setup/setupmongo.js', (error, stdout, stderr) => {
        if (error) {
            console.error(`Chyba pri spúšťaní setupmongo.js: ${error}`);
            return;
        }
        console.log(`setupmongo.js: ${stdout}`);
    });
}
// Spustí npm install v backend adresári
runNpmInstall('./backend', runSetupMongo); // Nahraďte '/cesta/k/backend' skutočnou cestou k backend adresáru

// Spustí npm install v frontend/client_app adresári
runNpmInstall('./frontend/client_app', () => {}); // Nahraďte '/cesta/k/frontend/client_app' skutočnou cestou k frontend/client_app adresáru

