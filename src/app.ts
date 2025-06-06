import createError from 'http-errors';
import express, { Application, Request, Response, NextFunction } from 'express';
import session from 'express-session';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import 'dotenv/config';

// Importar tipos para express-session
import { SessionOptions } from 'express-session';

// Extender el tipo de sesión
declare module 'express-session' {
  interface SessionData {
    message?: string;
    success?: boolean;
  }
}

const app: Application = express();

// Configuración del motor de vistas
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Middlewares
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

const sessionSecret = process.env.SESSION_SECRET;
const nodeEnv = process.env.NODE_ENV;

if (nodeEnv == 'production') {
  app.set('trust proxy', 1); // Confía en el primer proxy (ej. Nginx, Heroku, Render)
}

const sessionConfig: SessionOptions = {
  secret: sessionSecret || 'something',
  resave: false,
  saveUninitialized: true,
  cookie: { 
    secure: nodeEnv == 'production',
    sameSite: 'none',
    maxAge: 24 * 60 * 60 * 1000 // 1 día
  }
};

app.use(session(sessionConfig));

declare module 'express-session' {
  interface SessionData {
    message?: string;
    success?: boolean;
    paymentMessage?: string;  
    paymentSuccess?: boolean; 
  }
}

// Middleware para pasar mensajes a las vistas
app.use((req: Request, res: Response, next: NextFunction) => {
  // Mensajes generales
  res.locals.message = req.session.message;
  res.locals.success = req.session.success;
  
  // Mensajes específicos de pagos (opcional)
  res.locals.paymentMessage = req.session.paymentMessage;
  res.locals.paymentSuccess = req.session.paymentSuccess;
  
  // Limpiar todos los mensajes
  req.session.message = undefined;
  req.session.success = undefined;
  req.session.paymentMessage = undefined;
  req.session.paymentSuccess = undefined;
  
  next();
});

app.use((req, res, next) => {
  res.locals.gaKey = process.env.GOOGLE_ANALYTICS_KEY || '';
  res.locals.cD = process.env.COOKIE_DOMAIN || '';
  next();
});

const staticFilesPath = path.join(__dirname, 'public');
app.use(express.static(staticFilesPath, {
  setHeaders: (res) => {
    res.header('Cache-Control', 'public, max-age=3600');
  }
}));

// Importar rutas
import indexRouter from './routes/index';
import usersRouter from './routes/users';

// Rutas
app.use('/', indexRouter);
app.use('/users', usersRouter);

// Manejo de error 404
app.use((req: Request, res: Response, next: NextFunction) => {
  next(createError(404));
});

// Manejador de errores
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});

export default app;
