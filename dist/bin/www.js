#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("../app"));
const http_1 = __importDefault(require("http"));
// Validar importación de app
if (!app_1.default) {
    console.error('Error: No se pudo importar la aplicación Express');
    process.exit(1);
}
;
const port = normalizePort(process.env.PORT || '3000');
app_1.default.set('port', port);
const server = http_1.default.createServer(app_1.default);
server.listen(port);
server.on('error', onError);
server.on('listening', onListening);
// Cierre limpio ante señales de terminación
process.on('SIGINT', () => {
    console.log('\nServidor cerrando...');
    server.close(() => process.exit(0));
});
function normalizePort(val) {
    const port = parseInt(val, 10);
    if (isNaN(port))
        return val; // Named pipe
    if (port >= 0)
        return port; // Puerto válido
    throw new Error(`Puerto inválido: ${val}`);
}
;
function onError(error) {
    if (error.syscall !== 'listen')
        throw error;
    const bind = typeof port === 'string' ? `Pipe ${port}` : `Port ${port}`;
    switch (error.code) {
        case 'EACCES':
            console.error(`${bind} requiere permisos elevados`);
            process.exit(1);
        case 'EADDRINUSE':
            console.error(`${bind} ya está en uso`);
            process.exit(1);
        default:
            throw error;
    }
}
;
function onListening() {
    const addr = server.address();
    const bind = typeof addr === 'string'
        ? `pipe ${addr}`
        : `port ${addr.port}`;
}
;
