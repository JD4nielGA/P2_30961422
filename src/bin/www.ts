#!/usr/bin/env node

import app from '../app';
import http from 'http';
import { AddressInfo } from 'net';

// Validar importación de app
if (!app) {
  console.error('Error: No se pudo importar la aplicación Express');
  process.exit(1);
};

const port: number | string = normalizePort(process.env.PORT || '3000');
app.set('port', port);

const server = http.createServer(app);

server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

// Cierre limpio ante señales de terminación
process.on('SIGINT', () => {
  console.log('\nServidor cerrando...');
  server.close(() => process.exit(0));
});

function normalizePort(val: string): number | string {
  const port = parseInt(val, 10);
  if (isNaN(port)) return val;  // Named pipe
  if (port >= 0) return port;   // Puerto válido
  throw new Error(`Puerto inválido: ${val}`);
};

function onError(error: NodeJS.ErrnoException): void {
  if (error.syscall !== 'listen') throw error;

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
};

function onListening(): void {
  const addr = server.address() as AddressInfo;
  const bind = typeof addr === 'string' 
    ? `pipe ${addr}` 
    : `port ${addr.port}`;
};