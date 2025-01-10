import { PaymentProvider } from '@prisma/client';
import CODPaymentProvider from './codprovider';
import IPaymentProvider from './protocol';
import StripePaymentProvider from './stripeProvider';
import CreateCODPayment from '../use-cases/cod/createPayment';
import PaymentRepository from '../../infrastructure/repositories';
import { MessageBroker } from '../../infrastructure/providers';
import HandlePaymentCreatedEvent from '../use-cases/stripe/handllePaytIntentCreatedEvent';
import HandlePaymentStatusChangeEvent from '../use-cases/stripe/handlePaymentStatusChangeEvent';
import { CreatePaymentDTO, FindPaymentsFilter, FindPaymentsOptions } from '../../domain/dtos';
import validateCreatePaymentDTO from '../../utils/joi';
import GetPaymentUsecase from '../use-cases/getPayment';
import GetPaymentsUsecase from '../use-cases/getPayments';

// This file should bring your usecases together. eg: userService could be a combination of all user related use cases
export class PaymentService {
  private readonly paymentsRepository = new PaymentRepository();
  private readonly messageBroker = new MessageBroker();
  private readonly createCODPayment = new CreateCODPayment(
    this.paymentsRepository,
    this.messageBroker
  );
  private readonly handlePaymentCreatedEvent = new HandlePaymentCreatedEvent(
    this.paymentsRepository,
    this.messageBroker
  );

  private readonly handlePaymentStatusChangedEvent =
    new HandlePaymentStatusChangeEvent(
      this.paymentsRepository,
      this.messageBroker
    );
    

  private providers: {
    [key in keyof typeof PaymentProvider]?: IPaymentProvider;
  };

  constructor() {
    this.providers = {
      [PaymentProvider.STRIPE]: new StripePaymentProvider(
        this.handlePaymentCreatedEvent,
        this.handlePaymentStatusChangedEvent
      ),
      // tabby: new TabbyPaymentProvider(),
      // tamara: new TamaraPaymentProvider(),
      [PaymentProvider.COD]: new CODPaymentProvider(this.createCODPayment),
    };
  }

  async createPayment(providerName: PaymentProvider, data: CreatePaymentDTO) {
    const provider = this.providers[providerName];
    if (!provider)
      throw new Error(`Payment provider ${providerName} not supported`);

    // validate data
    await validateCreatePaymentDTO(data);

    return await provider.createPayment(data);
  }

  async handleWebhook(providerName: PaymentProvider, req: unknown) {
    const provider = this.providers[providerName];
    if (!provider)
      throw new Error(`Payment provider ${providerName} not supported`);

    return provider.handlePaymentWebhook(req);
  }

  getPayments(query: {
    filter?: FindPaymentsFilter;
    options?: FindPaymentsOptions;
  }) {
    return new GetPaymentsUsecase(this.paymentsRepository).execute(query)
  }

  getPayment(query: {
    id: string
    userId?: string
    withInstallments?: boolean
  }) {
    return new GetPaymentUsecase(this.paymentsRepository).execute(query)
  }
}

export default new PaymentService();
