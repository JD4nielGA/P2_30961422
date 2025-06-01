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
exports.PaymentsController = void 0;
const PaymentService_1 = require("../services/PaymentService");
class PaymentsController {
    constructor() {
        this.service = new PaymentService_1.PaymentService();
    }
    add(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { service, email, cardholderName, cardNumber, expMonth, expYear, cvv, amount, currency } = req.body;
                const result = yield this.service.processPayment(service, email, cardholderName, cardNumber, expMonth, expYear, cvv, Number(amount), currency.toUpperCase());
                req.session.message = result.message;
                req.session.success = true;
                return res.redirect('/');
            }
            catch (error) {
                req.session.message = error instanceof Error ? error.message : 'Error en el pago';
                req.session.success = false;
                return res.redirect('/');
            }
        });
    }
}
exports.PaymentsController = PaymentsController;
