// You can modify this file the way you like but make sure to export the router as default so that it initialised in index.ts
import express, { Router } from 'express';
import handleCreatePayment from './handlers/createPayment';
import paymentService from '../../../application/services';
import { PaymentProvider } from '@prisma/client';
import handleGetPayment from './handlers/getPayment';
import handleGetPayments from './handlers/getPayments';

const router = Router();

// Define your routes here

router.get('/', handleGetPayments);

router.post('/create-payment', handleCreatePayment);


// Webhooks.
router.post(`/webhook/stripe`, express.raw({ type: 'application/json' }), async (req, res, next) => {
    try {
        await paymentService.handleWebhook(PaymentProvider.STRIPE, req);
        
        res.status(200).json({
            message: 'Successfully handled event'
        })
    } catch (err) {
        console.log(err)
        next(err)
    }
});


// router.post('/webhook/tabby', (req) => {
//     paymentService.handleWebhook(PaymentProvider.TABBY, req)
// })

// router.post('/webhook/tamara', (req) => {
//     paymentService.handleWebhook(PaymentProvider.TAMARA, req)
// })

router.get('/:id', handleGetPayment);
export default router;
