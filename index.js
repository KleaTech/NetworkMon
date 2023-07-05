const ping = require ("net-ping");
const wifi = require('node-wifi');
const fs = require('fs');

const session = ping.createSession();
wifi.init({
    iface: 'en0'
});

[`exit`, `SIGINT`, `SIGUSR1`, `SIGUSR2`, `uncaughtException`, `SIGTERM`].forEach(eventType => 
    process.on(eventType, (error) => {
        console.log(error);
        session.close();
        process.exit();
    }));

function getWifiDetails(callback) {
    wifi.getCurrentConnections((error, currentConnections) => callback(error?.toString() ?? JSON.stringify(currentConnections, null, 2)));
}

function log(message) {
    process.stdout.write('\n');
    console.log(message.toString());
    fs.appendFileSync('log.txt', message.toString() + '\n');
}

function loop() {
    session.pingHost ('8.8.8.8', error => {
        if (error) {
            log(new Date());
            log(error.toString());
            getWifiDetails(log);
        } else {
            process.stdout.write('.');
        }
    });
}

console.log('Started monitoring internet access. Keep it running.');
setInterval(loop, 3000);
