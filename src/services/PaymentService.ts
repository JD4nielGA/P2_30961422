import { validateEmail, validateText, validateCardNumber, validateCVV, validateExpiration, validateAmount } from '../utils/validators';

export class PaymentService {
    private readonly NAME_MIN = 2;
  private readonly NAME_MAX = 100;
    private readonly ALLOWED_CURRENCIES = ['USD', 'EUR'];

    public async processPayment(
        service: string,
        email: string,
        cardholderName: string,
        cardNumber: string,
        expMonth: string,
        expYear: string,
        cvv: string,
        amount: number,
        currency: string
    ) {
        if (!this.ALLOWED_CURRENCIES.includes(currency)) {
            throw new Error(`Moneda no permitida: ${currency}`);
        }

        // Validación de proveedor
        if (!['Stripe', 'PayPal', 'MercadoPago'].includes(service)) {
            throw new Error('Proveedor no soportado');
        }

        if (!validateText(cardholderName, this.NAME_MIN, this.NAME_MAX)) {
      throw new Error(`Nombre del titular debe tener entre ${this.NAME_MIN}-${this.NAME_MAX} caracteres`);
    }

    if (!validateCardNumber(cardNumber)) throw new Error('Número de tarjeta inválido');

    if (!validateExpiration(expMonth, expYear)) {
      throw new Error('Fecha de expiración inválida o fuera de rango');
    }

    if (!validateCVV(cvv)) throw new Error('CVV inválido (3-4 dígitos)');

    if (!validateAmount(amount)) throw new Error('Monto inválido');

    if (!validateEmail(email)) {
      throw new Error('Email inválido');
    }

        // Procesamiento con el proveedor
        const paymentResult = await this.processWithProvider(service, amount, currency);

        return {
            success: true,
            transactionId: paymentResult.id,
            message: 'Pago realizado'
        };
    }

    private async processWithProvider(service: string, amount: number, currency: string) {
        // Lógica específica de cada proveedor
        if (service === 'stripe') {
            return { id: `stripe_${Math.random().toString(36).slice(2)}` };
        } else {
            return { id: `paypal_${Math.random().toString(36).slice(2)}` };
        }
    }
}
