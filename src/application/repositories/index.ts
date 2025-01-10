import { Prisma } from '@prisma/client';
import { Payment } from '../../domain/entities';

export default interface IPaymentRepository {
  createPayment(payment: Prisma.PaymentCreateArgs): Promise<Payment>;
  getPaymentById(paymentId: string, withInstallments?: boolean): Promise<Payment | null>;
  getFirstPayment(params: Prisma.PaymentFindFirstArgs): Promise<Payment | null>;
  getPayments(filter: Prisma.PaymentFindManyArgs): Promise<Payment[]>;
  countPayments(filter: Prisma.PaymentCountArgs): Promise<number>;
  updatePayment(data: Prisma.PaymentUpdateArgs): Promise<Payment>;
  deletePayment(paymentId: string): Promise<Payment>;

}
