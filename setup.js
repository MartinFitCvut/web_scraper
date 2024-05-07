const { exec } = require('child_process');

// Funkcia na spustenie npm install v danom adresári
function runNpmInstall(directory) {
    exec('npm install', { cwd: directory }, (error, stdout, stderr) => {
        if (error) {
            console.error(`Chyba pri inštalácii v ${directory}: ${error}`);
            return;
        }
        console.log(`Inštalácia v ${directory} dokončená.`);
    });
}

// Spustí npm install v backend adresári
runNpmInstall('./backend'); // Nahraďte '/cesta/k/backend' skutočnou cestou k backend adresáru

// Spustí npm install v frontend/client_app adresári
runNpmInstall('./frontend/client_app'); // Nahraďte '/cesta/k/frontend/client_app' skutočnou cestou k frontend/client_app adresáru
