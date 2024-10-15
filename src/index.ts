import kafkaService from './application/services/kafkaService';
import startExpressServer from './presentation/express';
import kafkaMessageController from './presentation/http/controllers/kafka-controller';
import { orderCreated } from './utils/kafkaTopics.json';

export default async function startServer() {
  startExpressServer();
  kafkaService.registerConsumers([orderCreated], kafkaMessageController);
}
