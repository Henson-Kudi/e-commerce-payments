import Stripe from 'stripe';
import { CreatePaymentDTO } from '../../domain/dtos';
import IPaymentProvider from './protocol';
import envConf from '../../env.conf';
import RequestObject from '../../utils/types/requestObject';
import HandlePaymentCreatedEvent from '../use-cases/stripe/handllePaytIntentCreatedEvent';
import HandlePaymentStatusChangeEvent from '../use-cases/stripe/handlePaymentStatusChangeEvent';
import { PaymentStatus } from '@prisma/client';
import {
  paymentSuccess,
  paymentFailed,
  paymentCancelled,
} from '../../utils/kafkaTopics.json';
import logger from '../../utils/logger';

export default class StripePaymentProvider
  implements IPaymentProvider<Stripe.PaymentIntent> {
  private readonly stripe: Stripe;

  private readonly handlepaymentCreatedEvent: HandlePaymentCreatedEvent;
  private readonly handlePaymentStatusChangedEvent: HandlePaymentStatusChangeEvent;

  constructor(
    handlePaymentCreratedEvent: HandlePaymentCreatedEvent,
    handlePaymentStatusChangedEvent: HandlePaymentStatusChangeEvent
  ) {
    this.stripe = new Stripe(envConf.stripeSecretKey, {
      apiVersion: '2024-06-20',
    });

    this.handlepaymentCreatedEvent = handlePaymentCreratedEvent;
    this.handlePaymentStatusChangedEvent = handlePaymentStatusChangedEvent;
  }

  async createPayment(data: CreatePaymentDTO): Promise<Stripe.PaymentIntent> {
    const paymentIntent = await this.stripe.paymentIntents.create({
      amount: Math.round(data.totalAmount * 100),
      currency: data.currency,
      payment_method_types: ['card'],
      metadata: { data: JSON.stringify(data) },
    });

    return paymentIntent;
  }

  async handlePaymentWebhook(req: RequestObject): Promise<void> {

    const endpointSecret = envConf.stripeWebhookSecret;

    let event: Stripe.Event;

    const sig = req.headers?.['stripe-signature'];

    if (!sig) {
      throw new Error('Stripe signature not found');
    }

    event = this.stripe.webhooks.constructEvent(
      req?.body,
      sig,
      endpointSecret
    );

    const paymentIntent = event.data.object as Stripe.PaymentIntent;

    switch (event.type) {
      case 'payment_intent.succeeded':
        // Update payment record to success
        await this.handlePaymentStatusChangedEvent.execute({
          intent: paymentIntent,
          kafkaTopic: paymentSuccess,
          status: PaymentStatus.COMPLETED,
        });
        break;
      case 'payment_intent.payment_failed':
        // When payment failed, update payment record to fail
        await this.handlePaymentStatusChangedEvent.execute({
          intent: paymentIntent,
          kafkaTopic: paymentFailed,
          status: PaymentStatus.FAILED,
        });
        break;

      case 'payment_intent.created':
        // When payment intent is created, we want to create a new payment
        await this.handlepaymentCreatedEvent.execute(paymentIntent);
        break;

      case 'payment_intent.canceled':
        // If payment intent is cancelled, then we want to update the payment to cancelled
        await this.handlePaymentStatusChangedEvent.execute({
          intent: paymentIntent,
          kafkaTopic: paymentCancelled,
          status: PaymentStatus.CANCELLED,
        });
        break;
      default:
        logger.error(`Unhandled event type: ${event.type}`);
    }
  }
}
