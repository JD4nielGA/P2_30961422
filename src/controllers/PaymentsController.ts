import { Request, Response } from 'express';
import { PaymentService } from '../services/PaymentService';

export class PaymentsController {
    private service = new PaymentService();

    public async add(req: Request, res: Response) {
        try {
            const { service, email, cardholderName, cardNumber, expMonth, expYear, cvv, amount, currency } = req.body;
            const result = await this.service.processPayment(
                service,
                email,
                cardholderName,
                cardNumber,
                expMonth,
                expYear,
                cvv,
                Number(amount),
                currency.toUpperCase()
            );

            req.session.message = result.message;
            req.session.success = true;
            return res.redirect('/');
        } catch (error) {
            req.session.message = error instanceof Error ? error.message : 'Error en el pago';
            req.session.success = false;
            return res.redirect('/');
        }
    }
}
