import { PaymentMethod, PaymentProvider, PaymentStatus } from '@prisma/client';

// Define how data will be transfered
export type PaginationOptions = {
  page?: number;
  limit?: number;
};

export type OrderItemDTO = {
  // orderId not required because it'll be connected automatically by prisma
  productId: string;
  productName: string;
  productSKU: string;
  quantity: number;
  price: number;
  total: number;
  tax: number;
};

export type ShippingAddressDTO = {
  address: string;
  buildingName?: string;
  landmark?: string;
  roomNo?: string;
  floor?: string;
  city: string;
  state: string;
  country: string;
  zipCode?: string;
};

// provider: PaymentProvider, amount: number, currency: string, paymentMethod: PaymentMethod, userId ?: string

export type CreatePaymentDTO = {
  userId?: string;
  userName: string;
  userEmail: string;
  userPhone: string;

  paymentMethod: PaymentMethod;
  provider: PaymentProvider;
  providerPaymentId?: string;

  orderId?: string;

  totalAmount: number;
  discount: number;
  currency: string;
  orderItems: OrderItemDTO[];
  shippingAddress: ShippingAddressDTO;
};

export type UpdatePaymentDTO = {
  userId?: string;
  amount?: number;
  currency?: string;
  status?: PaymentStatus;
  paymentMethod?: PaymentMethod;
  provider?: PaymentProvider;
  providerPaymentId?: string;
  orderId?: string;
  name?: string;
  email?: string;
  phone?: string;
};

export type FindPaymentsFilter = {
  id?: string | string[];
  userId?: string | string[];
  amount?: {
    min?: number;
    max?: number;
  };
  currency?: string | string[];
  status?: PaymentStatus | PaymentStatus[];
  paymentMethod?: PaymentMethod | PaymentMethod[];
  provider?: PaymentProvider | PaymentProvider[];
  providerPaymentId?: string | string[];
  orderId?: string | string[];
  name?: string | string[];
  email?: string | string[];
  phone?: string | string[];
};

export type FindPaymentsOptions = {
  withInstallments?: boolean;
  withOrder?: boolean;
} & PaginationOptions;
