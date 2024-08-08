import Stripe from 'stripe';
import { CreatePaymentDTO } from '../../../domain/dtos';
import IUseCase from '../protocol';
import IPaymentRepository from '../../repositories';
import { IMessageBroker } from '../../providers';
import { PaymentProvider, PaymentStatus } from '@prisma/client';
import logger from '../../../utils/logger';
import { Payment } from '../../../domain/entities';

export default class HandlePaymentStatusChangeEvent
  implements
    IUseCase<
      {
        intent: Stripe.PaymentIntent;
        status: PaymentStatus;
        kafkaTopic: string;
      },
      Payment | null
    >
{
  constructor(
    private readonly paymentsRepository: IPaymentRepository,
    private readonly messageBroker: IMessageBroker
  ) {}

  async execute(data: {
    intent: Stripe.PaymentIntent;
    status: PaymentStatus;
    kafkaTopic: string;
  }): Promise<Payment | null> {
    let metadata: CreatePaymentDTO;

    try {
      metadata = JSON.parse(data.intent.metadata.data) as CreatePaymentDTO;
    } catch (err) {
      logger.error('Invalid stripe metadata \n -------------------');
      logger.error((err as Error).message, err);
    }

    if (!metadata!) {
      return null;
    }
    // We need to update created payment's status to fail
    const foundPayment = await this.paymentsRepository.getFirstPayment({
      where: {
        providerPaymentId: data.intent.id,
        provider: PaymentProvider.STRIPE,
      },
    });

    if (!foundPayment) {
      return null;
    }

    const updatedPayment = await this.paymentsRepository.updatePayment({
      where: {
        id: foundPayment.id,
      },
      data: {
        status: data.status,
      },
    });

    try {
      await this.messageBroker.publish({
        topic: data.kafkaTopic,
        messages: [
          {
            value: JSON.stringify({
              ...metadata, // we're passing metadata because it containes all information for order to be creted
              paymentId: updatedPayment.id,
            }),
          },
        ],
      });
    } catch (err) {
      logger.error((err as Error).message, err);
    }

    return updatedPayment;
  }
}
