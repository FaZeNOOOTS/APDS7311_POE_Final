const app = require('./app');
const fs = require('fs');
const https = require('https');

const port = 3000;

const server = https.createServer(
    {
        key: fs.readFileSync('Keys/privatekey.pem'),
        cert: fs.readFileSync('Keys/certificate.pem')
    },app);

server.listen(port)