"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentService = void 0;
const validators_1 = require("../utils/validators");
require("dotenv/config");
const axios_1 = __importDefault(require("axios"));
class PaymentService {
    constructor() {
        this.NAME_MIN = 2;
        this.NAME_MAX = 100;
        this.ALLOWED_CURRENCIES = ['USD', 'EUR'];
        this.PAYMENT_API = 'https://fakepayment.onrender.com/';
        this.FAKE_PAY = process.env.FAKE_PAY;
    }
    getHeaders() {
        return {
            'Authorization': `Bearer ${this.FAKE_PAY}`,
            'Content-Type': 'application/json'
        };
    }
    async processPayment(service, email, cardholderName, cardNumber, expMonth, expYear, cvv, amount, currency, description, reference) {
        // Procesamiento con el proveedor
        //const paymentResult = await this.processWithProvider(service, amount, currency);
        this.validateInput(service, email, cardholderName, cardNumber, expMonth, expYear, cvv, amount, currency);
        try {
            const paymentData = {
                amount: amount,
                'card-number': cardNumber,
                cvv: cvv,
                'expiration-month': expMonth,
                'expiration-year': expYear,
                'full-name': cardholderName,
                currency: currency,
                description: description,
                reference: reference
            };
            const response = await axios_1.default.post(`${this.PAYMENT_API}payments`, paymentData, { headers: this.getHeaders() });
            console.log('id: ' + response.data.data.transaction_id);
            console.log('Respuesta API:', JSON.stringify(response.data, null, 2));
            // La respuesta de la API externa debería contener la información del resultado del pago
            return {
                success: true,
                transactionId: response.data.data.transaction_id,
                message: 'Pago realizado',
                // Puedes incluir más información de la respuesta si es necesario
            };
        }
        catch (error) {
            console.error('Respuesta de la API (data):', JSON.stringify(error.response.data, null, 2));
            console.error('Error al procesar el pago con la API externa:', error.message);
            return {
                success: false,
                message: 'Error al procesar el pago',
                // Puedes incluir más información de la respuesta si es necesario
            };
            throw new Error('Error al procesar el pago');
        }
    }
    validateInput(service, email, cardholderName, cardNumber, expMonth, expYear, cvv, amount, currency) {
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
    }
    async getTransaction(transactionId) {
        try {
            const response = await axios_1.default.get(`${this.PAYMENT_API}payments/${transactionId}`, { headers: this.getHeaders() });
            console.log(response.data);
        }
        catch (error) {
            console.log(transactionId);
            console.log(`${this.PAYMENT_API}payments/:${transactionId}`);
            console.error('Error al obtener la transacción:', error.message);
        }
    }
    async processWithProvider(service, amount, currency) {
        // Lógica específica de cada proveedor
        if (service === 'stripe') {
            return { id: `stripe_${Math.random().toString(36).slice(2)}` };
        }
        else {
            return { id: `paypal_${Math.random().toString(36).slice(2)}` };
        }
    }
}
exports.PaymentService = PaymentService;
