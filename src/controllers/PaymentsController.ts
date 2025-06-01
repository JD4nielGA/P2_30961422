import { Request, Response } from 'express';
import { PaymentService } from '../services/PaymentService';
import { ValidateRecaptcha } from "../middlewares/Auth";

const validateRecaptcha = new ValidateRecaptcha

export class PaymentsController {
    private service = new PaymentService();

    public async add(req: Request, res: Response) {
        try {
            await validateRecaptcha.validate(req, res, async () => {
            const { 
              service, 
              email, 
              cardholderName, 
              cardNumber, 
              expMonth, 
              expYear, 
              cvv, 
              amount, 
              currency,
              description,
              reference
            } = req.body;

            try {
            const result = await this.service.processPayment(
                service,
                email,
                cardholderName,
                cardNumber,
                expMonth,
                expYear,
                cvv,
                Number(amount),
                currency.toUpperCase(),
                description,
                reference
            );

            await this.service.getTransaction(result.transactionId)

              req.session.message = result.message;
              req.session.success = true;
            } catch (serviceError) {
              req.session.message = serviceError instanceof Error ? serviceError.message : 'Error en el pago';
              req.session.success = false;
            }
            return res.redirect('/');
            })
        } catch (error) {
            req.session.message = error instanceof Error ? error.message : 'Error en el pago';
            req.session.success = false;
            return res.redirect('/');
        }
    }
}
