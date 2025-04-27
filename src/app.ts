import createError from 'http-errors';
import express, { Application, Request, Response, NextFunction } from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';

import indexRouter from './routes/index';
import usersRouter from './routes/users';

const app: Application = express();

// Configuración del motor de vistas
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Middlewares
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

const staticFilesPath = path.join(__dirname, 'public');
app.use(express.static(staticFilesPath, {
  setHeaders: (res) => {
    res.header('Cache-Control', 'public, max-age=3600');
  }
}));

// Rutas
app.use('/', indexRouter);
app.use('/users', usersRouter);

// Manejo de error 404
app.use((req: Request, res: Response, next: NextFunction) => {
  next(createError(404));
});

// Manejador de errores
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  // Establecer variables locales, solo proporcionando error en desarrollo
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // Renderizar la página de error
  res.status(err.status || 500);
  res.render('error');
});

export default app;