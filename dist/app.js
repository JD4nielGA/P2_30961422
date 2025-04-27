"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_errors_1 = __importDefault(require("http-errors"));
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const morgan_1 = __importDefault(require("morgan"));
const index_1 = __importDefault(require("./routes/index"));
const users_1 = __importDefault(require("./routes/users"));
const app = (0, express_1.default)();
// Configuración del motor de vistas
app.set('views', path_1.default.join(__dirname, 'views'));
app.set('view engine', 'ejs');
// Middlewares
app.use((0, morgan_1.default)('dev'));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
app.use((0, cookie_parser_1.default)());
const staticFilesPath = path_1.default.join(__dirname, 'public');
app.use(express_1.default.static(staticFilesPath, {
    setHeaders: (res) => {
        res.header('Cache-Control', 'public, max-age=3600');
    }
}));
// Rutas
app.use('/', index_1.default);
app.use('/users', users_1.default);
// Manejo de error 404
app.use((req, res, next) => {
    next((0, http_errors_1.default)(404));
});
// Manejador de errores
app.use((err, req, res, next) => {
    // Establecer variables locales, solo proporcionando error en desarrollo
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    // Renderizar la página de error
    res.status(err.status || 500);
    res.render('error');
});
exports.default = app;
