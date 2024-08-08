import { Prisma } from '@prisma/client';
import { Payment } from '../../domain/entities';

export default interface IPaymentRepository {
  createPayment(payment: Prisma.PaymentCreateArgs): Promise<Payment>;
  getPaymentById(paymentId: string): Promise<Payment | null>;
  getFirstPayment(params: Prisma.PaymentFindFirstArgs): Promise<Payment | null>;
  getPayments(filter: Prisma.PaymentFindManyArgs): Promise<Payment[]>;
  updatePayment(data: Prisma.PaymentUpdateArgs): Promise<Payment>;
  deletePayment(paymentId: string): Promise<Payment>;
}
