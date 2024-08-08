import Stripe from 'stripe';
import { CreatePaymentDTO } from '../../../domain/dtos';
import IUseCase from '../protocol';
import IPaymentRepository from '../../repositories';
import { IMessageBroker } from '../../providers';
import { PaymentProvider, PaymentStatus } from '@prisma/client';
import logger from '../../../utils/logger';
import { Payment } from '../../../domain/entities';
import { stripePaymentCreated } from '../../../utils/kafkaTopics.json';

export default class HandlePaymentCreatedEvent
  implements IUseCase<Stripe.PaymentIntent, Payment>
{
  constructor(
    private readonly paymentsRepository: IPaymentRepository,
    private readonly messageBroker: IMessageBroker
  ) {}

  async execute(data: Stripe.PaymentIntent): Promise<Payment> {
    const metadata = JSON.parse(data.metadata.data) as CreatePaymentDTO;
    // We need to create a payement at this level
    const newPayment = await this.paymentsRepository.createPayment({
      data: {
        amount: metadata.totalAmount,
        currency: metadata.currency,
        status: PaymentStatus.INITIATED,
        userId: metadata.userId,
        orderId: metadata.orderId,
        providerPaymentId: data.id,
        paymentMethod: metadata.paymentMethod,
        provider: PaymentProvider.STRIPE,
      },
    });
    try {
      await this.messageBroker.publish({
        topic: stripePaymentCreated,
        messages: [
          {
            value: JSON.stringify({
              ...metadata, // we're passing metadata because it containes all information for order to be creted
              paymentId: newPayment.id,
            }),
          },
        ],
      });
    } catch (err) {
      logger.error((err as Error).message, err);
    }

    return newPayment;
  }
}
