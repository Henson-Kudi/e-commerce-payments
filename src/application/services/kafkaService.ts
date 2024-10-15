import messageBroker from '../../infrastructure/providers';
import OrderCreatedHandler from '../use-cases/messageBroker/orderCreatedHandler';
import {
  MessageHandler,
  MessageSubscriptionParams,
} from '../../domain/dtos/messageBroker';
import { Message } from 'node-rdkafka';

export class KafkaService {
  private readonly messenger = messageBroker;

  registerConsumers(
    consumers: MessageSubscriptionParams,
    callback: MessageHandler
  ): void {
    this.messenger.subscribe(consumers, callback);
  }

  handleOrderCreatedEvent(payload: Message): Promise<void> {
    return new OrderCreatedHandler().execute(payload);
  }
}

const kafkaService = new KafkaService();

export default kafkaService;
