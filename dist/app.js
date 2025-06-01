"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_errors_1 = __importDefault(require("http-errors"));
const express_1 = __importDefault(require("express"));
const express_session_1 = __importDefault(require("express-session"));
const path_1 = __importDefault(require("path"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const morgan_1 = __importDefault(require("morgan"));
const app = (0, express_1.default)();
// Configuración del motor de vistas
app.set('views', path_1.default.join(__dirname, 'views'));
app.set('view engine', 'ejs');
// Middlewares
app.use((0, morgan_1.default)('dev'));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
app.use((0, cookie_parser_1.default)());
// Configuración de sesión con tipo explícito
const sessionConfig = {
    secret: process.env.SESSION_SECRET || 'something',
    resave: false,
    saveUninitialized: true,
    cookie: {
        secure: process.env.NODE_ENV === 'production',
        maxAge: 24 * 60 * 60 * 1000 // 1 día
    }
};
app.use((0, express_session_1.default)(sessionConfig));
// Middleware para pasar mensajes a las vistas
app.use((req, res, next) => {
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
const staticFilesPath = path_1.default.join(__dirname, 'public');
app.use(express_1.default.static(staticFilesPath, {
    setHeaders: (res) => {
        res.header('Cache-Control', 'public, max-age=3600');
    }
}));
// Importar rutas
const index_1 = __importDefault(require("./routes/index"));
const users_1 = __importDefault(require("./routes/users"));
// Rutas
app.use('/', index_1.default);
app.use('/users', users_1.default);
// Manejo de error 404
app.use((req, res, next) => {
    next((0, http_errors_1.default)(404));
});
// Manejador de errores
app.use((err, req, res, next) => {
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    res.status(err.status || 500);
    res.render('error');
});
exports.default = app;
