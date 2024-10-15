import { Message } from 'node-rdkafka';
import logger from '../../../../utils/logger';
import kafkaService from '../../../../application/services/kafkaService';
import { orderCreated } from '../../../../utils/kafkaTopics.json';

export default async function kafkaMessageController(
  message: Message
): Promise<void> {
  switch (message.topic) {
    case orderCreated:
      await kafkaService.handleOrderCreatedEvent(message);
      break;

    default:
      logger.warn(`No handler for topic: ${message.topic}`);
      break;
  }
}
