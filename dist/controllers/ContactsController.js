"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContactsController = void 0;
const ContactService_1 = require("../services/ContactService");
class ContactsController {
    constructor() {
        this.service = new ContactService_1.ContactService();
    }
    add(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, name, comment } = req.body;
                const ipAddress = req.ip || 'unknown';
                const result = yield this.service.add(email.trim(), name, comment, ipAddress);
                req.session.message = result.message;
                req.session.success = true;
                return res.redirect('/');
            }
            catch (error) {
                req.session.message = error instanceof Error ? error.message : 'Error al procesar el contacto';
                req.session.success = false;
                return res.redirect('/');
            }
        });
    }
    index(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const contacts = yield this.service.get();
                res.render('contacts', { title: 'Administración de Contactos', contacts });
            }
            catch (error) {
                res.status(500).render('error', { message: 'Error al cargar contactos' });
            }
        });
    }
}
exports.ContactsController = ContactsController;
