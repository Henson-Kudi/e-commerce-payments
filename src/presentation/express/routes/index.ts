// You can modify this file the way you like but make sure to export the router as default so that it initialised in index.ts
import { Router } from 'express';
import handleCreatePayment from './handlers/createPayment';
import paymentService from '../../../application/services';
import { PaymentProvider } from '@prisma/client';

const router = Router();

// Define your routes here

router.post('/create-payment', handleCreatePayment);

// Webhooks
router.post('/webhook/stripe', (req) => {
  paymentService.handleWebhook(PaymentProvider.STRIPE, req);
});

// router.post('/webhook/tabby', (req) => {
//     paymentService.handleWebhook(PaymentProvider.TABBY, req)
// })

// router.post('/webhook/tamara', (req) => {
//     paymentService.handleWebhook(PaymentProvider.TAMARA, req)
// })

export default router;
