import { ContactsModel } from '../models/ContactsModel';
import { validateEmail, validateText } from '../utils/validators';

export class ContactService {
    private model = new ContactsModel();

private readonly COMMENT_MIN = 10;
  private readonly COMMENT_MAX = 500;
  private readonly NAME_MIN = 2;
  private readonly NAME_MAX = 100;

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

        const dbResult = await this.model.add(email, name, comment, ipAddress);

        return {
            id: dbResult.id,
            message: 'Comentario enviado exitosamente'
        };
    }

    public async get() {
        return this.model.get();
    }

}
