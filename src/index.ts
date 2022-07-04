import http from 'http';
import { AddressInfo } from 'net';
import { app } from './app.js';

const PORT = process.env.PORT || 3500;
app.set('port', PORT);

export const server = http.createServer(app);

const onListening = () => {
    const addr = server.address();
    //  { address: '::', family: 6, port: 3400 }
    const bind =
        typeof addr === 'string'
            ? 'pipe ' + addr
            : addr?.address === '::'
            ? `http://localhost:${(addr as AddressInfo).port}`
            : (addr as AddressInfo).address + (addr as AddressInfo).port;

    console.log(`Listening on ${bind}`);
};

server.on('listening', onListening);
server.listen(PORT);
