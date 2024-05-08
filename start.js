const { exec } = require('child_process');

// Funkcia na spustenie servera
const startServer = () => {
    console.log('Spúšťam server...');
    exec('cd backend && node ./src/server.js', (error, stdout, stderr) => {
        if (error) {
            console.error(`Chyba pri spúšťaní servera: ${error.message}`);
            return;
        }
        if (stderr) {
            console.error(`Chyba pri spúšťaní servera: ${stderr}`);
            return;
        }
        console.log(`Server: ${stdout}`);
    });
};

// Funkcia na spustenie klienta

const startClient = () => {
    console.log('Spúšťam klienta...');
    exec('cd frontend/client_app && npm start', (error, stdout, stderr) => {
        if (error) {
            console.error(`Chyba pri spúšťaní klienta: ${error.message}`);
            return;
        }
        if (stderr) {
            console.error(`Chyba pri spúšťaní klienta: ${stderr}`);
            return;
        }
        console.log(`Klient: ${stdout}`);
    });
};

// Spustenie servera a klienta
startServer();
startClient();
