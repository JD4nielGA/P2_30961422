import axios from 'axios';
import { ContactsModel } from '../models/ContactsModel';
import { validateEmail, validateText } from '../utils/validators';
import 'dotenv/config';

export class ContactService {
    private model = new ContactsModel();

private readonly COMMENT_MIN = 10;
  private readonly COMMENT_MAX = 500;
  private readonly NAME_MIN = 2;
  private readonly NAME_MAX = 100;
  private readonly IPSTACK_API_KEY = process.env.IPSTACK; 

    public async add(
        email: string,
        name: string,
        comment: string,
        ipAddress: string
    ) {
        // Validaciones
        if (!validateEmail(email)) {
            throw new Error('Email inválido');
        }

        if (!validateText(name, this.NAME_MIN, this.NAME_MAX)) {
          throw new Error(`Nombre debe tener entre ${this.NAME_MIN}-${this.NAME_MAX} caracteres`);
        }
        if (!validateText(comment, this.COMMENT_MIN, this.COMMENT_MAX)) {
          throw new Error(`Comentario debe tener entre ${this.COMMENT_MIN}-${this.COMMENT_MAX} caracteres`);
        }

        const country = await this.getCountryFromIp(ipAddress);
        const dbResult = await this.model.add(email, name, comment, country, ipAddress);

        return {
            id: dbResult.id,
            country: country,
            message: 'Comentario enviado exitosamente'
        };
    }

    private async getCountryFromIp(ip: string): Promise<string> {
        try {
            const response = await axios.get(
                `http://api.ipstack.com/${ip}?access_key=${this.IPSTACK_API_KEY}`
            );
            return response.data.country_name || 'Desconocido';
        } catch (error) {
            console.error('Error al obtener país:', error);
            return 'Desconocido'; // Manejo seguro si falla ipstack
        }
    }

    public async get() {
        return this.model.get();
    }

}
