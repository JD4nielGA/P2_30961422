import { Router, Request, Response } from 'express';
import { ContactsController } from '../controllers/ContactsController';
import { PaymentsController } from '../controllers/PaymentsController';
import 'dotenv/config';

const router = Router();
const contactsController = new ContactsController();
const paymentsController = new PaymentsController();
const googleAnalyticsKey = process.env.GOOGLE_ANALYTICS_KEY;
const googleRecatpcha = process.env.RECATPCHA_HTML;

/* GET home page. */
router.get('/', (req: Request, res: Response) => {
  res.render('index', { 
    title: 'TutorNest',
    gaKey: googleAnalyticsKey,
    grKey: googleRecatpcha,
    paymentServices: ['PayPal', 'Stripe', 'MercadoPago'],            
    showPaymentForm: true
  });
});

router.get('/admin/contacts', (req, res) => contactsController.index(req, res)
);

router.post('/contact/add', (req, res) => contactsController.add(req, res));
router.post('/payment/add', (req, res) => paymentsController.add(req, res));

export default router;
