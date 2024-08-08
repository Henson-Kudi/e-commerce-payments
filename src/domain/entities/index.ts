// Define your schema entities
import {
  Payment as PaymentEntity,
  Installment as InstallmentEntity,
} from '@prisma/client';

export type Payment = PaymentEntity & {
  installments?: InstallmentEntity[];
};

export type Installment = InstallmentEntity & { payment?: PaymentEntity };
