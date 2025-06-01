"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailService = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
require("dotenv/config");
class EmailService {
    constructor() {
        this.transporter = nodemailer_1.default.createTransport({
            // ... tu configuración del transportador
            service: 'Gmail', // Ejemplo
            auth: {
                user: process.env.GMAIL_USER,
                pass: process.env.GMAIL_PASSWORD,
            },
        });
        this.emailFrom = process.env.EMAIL_FROM || 'tu_correo@example.com';
        this.emailTo = process.env.EMAIL_TO || 'destinatario@example.com';
    }
    async sendContactFormNotification(formData) {
        try {
            const mailOptions = {
                from: this.emailFrom,
                to: this.emailTo,
                subject: 'Nuevo Formulario de Contacto Recibido',
                html: `<p>Se ha recibido un nuevo envío del formulario de contacto:</p>
               <ul>
                 <li><strong>Nombre:</strong> ${formData.name || 'No proporcionado'}</li>
                 <li><strong>Correo:</strong> ${formData.debugedEmail || 'No proporcionado'}</li>
                 <li><strong>Comentario:</strong> ${formData.comment || 'No proporcionado'}</li>
                 <li><strong>Dirección IP:</strong> ${formData.ipAddress || 'No proporcionado'}</li>
                 <li><strong>País:</strong> ${formData.country || 'No proporcionado'}</li>
                 <li><strong>Fecha y Hora:</strong> ${formData.dateTime || 'No proporcionado'}</li>
               </ul>`,
            };
            const info = await this.transporter.sendMail(mailOptions);
            console.log('Correo electrónico enviado:', info.messageId);
            return true;
        }
        catch (error) {
            console.error('Error al enviar el correo:', error);
            return false;
        }
    }
}
exports.EmailService = EmailService;
