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
exports.PaymentService = void 0;
const validators_1 = require("../utils/validators");
class PaymentService {
    constructor() {
        this.NAME_MIN = 2;
        this.NAME_MAX = 100;
        this.ALLOWED_CURRENCIES = ['USD', 'EUR'];
    }
    processPayment(service, email, cardholderName, cardNumber, expMonth, expYear, cvv, amount, currency) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.ALLOWED_CURRENCIES.includes(currency)) {
                throw new Error(`Moneda no permitida: ${currency}`);
            }
            // Validación de proveedor
            if (!['Stripe', 'PayPal', 'MercadoPago'].includes(service)) {
                throw new Error('Proveedor no soportado');
            }
            if (!(0, validators_1.validateText)(cardholderName, this.NAME_MIN, this.NAME_MAX)) {
                throw new Error(`Nombre del titular debe tener entre ${this.NAME_MIN}-${this.NAME_MAX} caracteres`);
            }
            if (!(0, validators_1.validateCardNumber)(cardNumber))
                throw new Error('Número de tarjeta inválido');
            if (!(0, validators_1.validateExpiration)(expMonth, expYear)) {
                throw new Error('Fecha de expiración inválida o fuera de rango');
            }
            if (!(0, validators_1.validateCVV)(cvv))
                throw new Error('CVV inválido (3-4 dígitos)');
            if (!(0, validators_1.validateAmount)(amount))
                throw new Error('Monto inválido');
            if (!(0, validators_1.validateEmail)(email)) {
                throw new Error('Email inválido');
            }
            // Procesamiento con el proveedor
            const paymentResult = yield this.processWithProvider(service, amount, currency);
            return {
                success: true,
                transactionId: paymentResult.id,
                message: 'Pago realizado'
            };
        });
    }
    processWithProvider(service, amount, currency) {
        return __awaiter(this, void 0, void 0, function* () {
            // Lógica específica de cada proveedor
            if (service === 'stripe') {
                return { id: `stripe_${Math.random().toString(36).slice(2)}` };
            }
            else {
                return { id: `paypal_${Math.random().toString(36).slice(2)}` };
            }
        });
    }
}
exports.PaymentService = PaymentService;
