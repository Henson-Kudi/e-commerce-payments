import { PaymentProvider, PaymentStatus } from '@prisma/client';
import { CreatePaymentDTO } from '../../../domain/dtos';
import { Payment } from '../../../domain/entities';
import { IMessageBroker } from '../../providers';
import IPaymentRepository from '../../repositories';
import IUseCase from '../protocol';
import { codPaymentCreated } from '../../../utils/kafkaTopics.json';
import logger from '../../../utils/logger';

export default class CreateCODPayment implements IUseCase {
  constructor(
    private readonly paymentsRepository: IPaymentRepository,
    private readonly messageBroker: IMessageBroker
  ) {}

  async execute(data: CreatePaymentDTO): Promise<Payment> {
    const newPayment = await this.paymentsRepository.createPayment({
      data: {
        amount: data.totalAmount,
        currency: data.currency,
        status: PaymentStatus.PENDING,
        userId: data.userId,
        orderId: data.orderId,
        providerPaymentId: null,
        paymentMethod: data.paymentMethod,
        provider: PaymentProvider.COD,
      },
    });
    try {
      await this.messageBroker.publish({
        topic: codPaymentCreated,
        messages: [
          {
            value: JSON.stringify({
              ...data, // we're passing metadata because it containes all information for order to be creted
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
