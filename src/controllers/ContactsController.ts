import { Request, Response } from 'express';
import { ContactService } from '../services/ContactService';

export class ContactsController {
    private service = new ContactService();

    public async add(req: Request, res: Response) {
        try {
            const { email, name, comment } = req.body;
            const ipAddress = req.ip || 'unknown';

            const result = await this.service.add(email.trim(), name, comment, ipAddress);
            
            req.session.message = result.message;
            req.session.success = true;
            return res.redirect('/');
        } catch (error) {
            req.session.message = error instanceof Error ? error.message : 'Error al procesar el contacto';
            req.session.success = false;
            return res.redirect('/');
        }
    }

    public async index(req: Request, res: Response) {
        try {
            const contacts = await this.service.get();
            res.render('contacts', { title: 'Administración de Contactos', contacts });
        } catch (error) {
            res.status(500).render('error', { message: 'Error al cargar contactos' });
        }
    }
}
