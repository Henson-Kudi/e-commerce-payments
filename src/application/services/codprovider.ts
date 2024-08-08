import { CreatePaymentDTO } from '../../domain/dtos';
import { Payment } from '../../domain/entities';
import logger from '../../utils/logger';
import CreateCODPayment from '../use-cases/cod/createPayment';
import IPaymentProvider from './protocol';

export default class CODPaymentProvider implements IPaymentProvider<Payment> {
  private readonly createCODpayment: CreateCODPayment;

  constructor(createCODpayment: CreateCODPayment) {
    this.createCODpayment = createCODpayment;
  }

  createPayment(data: CreatePaymentDTO) {
    return this.createCODpayment.execute(data);
  }

  async handlePaymentWebhook() {
    logger.error('No webhook handlers for COD payments');
  }
}
