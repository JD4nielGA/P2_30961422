"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentsController = void 0;
const PaymentService_1 = require("../services/PaymentService");
const Auth_1 = require("../middlewares/Auth");
const validateRecaptcha = new Auth_1.ValidateRecaptcha;
class PaymentsController {
    constructor() {
        this.service = new PaymentService_1.PaymentService();
    }
    async add(req, res) {
        try {
            await validateRecaptcha.validate(req, res, async () => {
                const { service, email, cardholderName, cardNumber, expMonth, expYear, cvv, amount, currency, description, reference } = req.body;
                try {
                    const result = await this.service.processPayment(service, email, cardholderName, cardNumber, expMonth, expYear, cvv, Number(amount), currency.toUpperCase(), description, reference);
                    await this.service.getTransaction(result.transactionId);
                    req.session.message = result.message;
                    req.session.success = true;
                }
                catch (serviceError) {
                    req.session.message = serviceError instanceof Error ? serviceError.message : 'Error en el pago';
                    req.session.success = false;
                }
                return res.redirect('/');
            });
        }
        catch (error) {
            req.session.message = error instanceof Error ? error.message : 'Error en el pago';
            req.session.success = false;
            return res.redirect('/');
        }
    }
}
exports.PaymentsController = PaymentsController;
