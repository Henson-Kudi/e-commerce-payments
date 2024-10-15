import IUseCase from '../protocol';
import logger from '../../../utils/logger';
import PaymentRepository from '../../../infrastructure/repositories';
import { Message } from 'node-rdkafka';

export default class OrderCreatedHandler implements IUseCase<Message, void> {
  async execute(payload: Message): Promise<void> {
    try {
      const paymentRepo = new PaymentRepository();
      if (!payload.value) {
        return;
      }

      const parsedValue = JSON.parse(payload.value?.toString());

      if (!parsedValue.paymentId) {
        return;
      }
      const foundItem = await paymentRepo.getPaymentById(parsedValue.paymentId);
      if (!foundItem) {
        return;
      }
      if (!foundItem.orderId) {
        await paymentRepo.updatePayment({
          data: {
            orderId: parsedValue.id,
          },
          where: {
            id: parsedValue.paymentId,
          },
        });

        logger.info(
          `Order id for payment ${parsedValue.paymentId} has been updated to ${parsedValue.id}`
        );
      }
    } catch (err) {
      logger.error((err as Error).message, err);
    }
  }
}
