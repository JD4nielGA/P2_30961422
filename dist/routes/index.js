"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const ContactsController_1 = require("../controllers/ContactsController");
const PaymentsController_1 = require("../controllers/PaymentsController");
const router = (0, express_1.Router)();
const contactsController = new ContactsController_1.ContactsController();
const paymentsController = new PaymentsController_1.PaymentsController();
/* GET home page. */
router.get('/', (req, res) => {
    res.render('index', {
        title: 'TutorNest',
        paymentServices: ['PayPal', 'Stripe', 'MercadoPago'],
        showPaymentForm: true
    });
});
router.get('/admin/contacts', (req, res) => contactsController.index(req, res));
router.post('/contact/add', (req, res) => contactsController.add(req, res));
router.post('/payment/add', (req, res) => paymentsController.add(req, res));
exports.default = router;
