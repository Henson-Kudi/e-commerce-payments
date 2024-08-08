import { Prisma } from '@prisma/client';
import IPaymentRepository from '../../application/repositories';
import { Payment } from '../../domain/entities';
import database from '../database';

// Implementation of all database repositories defined in application/repositories
export default class PaymentRepository implements IPaymentRepository {
  getFirstPayment(
    params: Prisma.PaymentFindFirstArgs
  ): Promise<Payment | null> {
    return database.payment.findFirst(params);
  }
  createPayment(payment: Prisma.PaymentCreateArgs): Promise<Payment> {
    return database.payment.create(payment);
  }
  getPaymentById(paymentId: string): Promise<Payment | null> {
    return database.payment.findUnique({ where: { id: paymentId } });
  }
  getPayments(filter: Prisma.PaymentFindManyArgs): Promise<Payment[]> {
    return database.payment.findMany(filter);
  }
  updatePayment(data: Prisma.PaymentUpdateArgs): Promise<Payment> {
    return database.payment.update(data);
  }
  deletePayment(paymentId: string): Promise<Payment> {
    return database.payment.delete({ where: { id: paymentId } });
  }
}
