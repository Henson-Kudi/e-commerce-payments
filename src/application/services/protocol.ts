import { CreatePaymentDTO } from '../../domain/dtos';

// Define interfaces for your repositories. How to communicate with your database
export default interface IPaymentProvider<ReturnValue = unknown> {
  createPayment(data: CreatePaymentDTO): Promise<ReturnValue>;
  handlePaymentWebhook(req: unknown): Promise<void>;
}
