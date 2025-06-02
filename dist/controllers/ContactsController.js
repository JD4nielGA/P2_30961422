"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContactsController = void 0;
const ContactService_1 = require("../services/ContactService");
const Auth_1 = require("../middlewares/Auth");
const EmailService_1 = require("../services/EmailService");
const validateRecaptcha = new Auth_1.ValidateRecaptcha;
const emailSent = new EmailService_1.EmailService;
class ContactsController {
    constructor() {
        this.service = new ContactService_1.ContactService();
    }
    async add(req, res) {
        try {
            await validateRecaptcha.validate(req, res, async () => {
                const { email, name, comment } = req.body;
                const xForwardedFor = req.headers['x-forwarded-for'];
                let ipAddress = ''; // Inicializamos con valor por defecto
                let debugedEmail = email.trim();
                if (Array.isArray(xForwardedFor)) {
                    ipAddress = xForwardedFor[0] || req.ip || '';
                }
                else if (typeof xForwardedFor === 'string') {
                    ipAddress = xForwardedFor.split(',')[0] || req.ip || '';
                }
                else {
                    ipAddress = req.ip || ''; // Fallback con valor por defecto
                }
                try {
                    const result = await this.service.add(debugedEmail, name, comment, ipAddress);
                    const now = new Date();
                    await emailSent.sendContactFormNotification({
                        name,
                        debugedEmail,
                        comment,
                        ipAddress,
                        country: result.country,
                        dateTime: now.toLocaleString()
                    });
                    req.session.message = result.message;
                    req.session.success = true;
                }
                catch (serviceError) {
                    req.session.message = serviceError instanceof Error ? serviceError.message : 'Error al procesar el contacto';
                    req.session.success = false;
                }
                return res.redirect('/');
            });
        }
        catch (error) {
            console.error("Error capturado en el controlador:", error); // Agrega esto para ver el error
            req.session.message = error instanceof Error ? error.message : 'Error al procesar el contacto';
            req.session.success = false;
            return res.redirect('/');
        }
    }
    async index(req, res) {
        try {
            const contacts = await this.service.get();
            res.render('contacts', {
                title: 'Administración de Contactos',
                gaKey: process.env.GOOGLE_ANALYTICS_KEY || '',
                cD: process.env.COOKIE_DOMAIN || '',
                contacts
            });
        }
        catch (error) {
            res.status(500).render('error', { message: 'Error al cargar contactos' });
        }
    }
}
exports.ContactsController = ContactsController;
