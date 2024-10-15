import Joi from 'joi';

import { PaymentMethod, PaymentProvider } from '@prisma/client';

// OrderItemDTO and ShippingAddressDTO schemas would need to be defined similarly
const OrderItemDTOSchema = Joi.object({
  productId: Joi.string().required(),
  productName: Joi.string().required(),
  productSKU: Joi.string().required(),
  quantity: Joi.number().required().positive().greater(0),
  price: Joi.number().positive().required(),
  total: Joi.number().positive().required(),
  tax: Joi.number().positive().required(),
});

const ShippingAddressDTOSchema = Joi.object({
  address: Joi.string().required(),
  buildingName: Joi.string().optional().allow('').allow(null),
  landmark: Joi.string().optional().allow('').allow(null),
  roomNo: Joi.string().optional().allow('').allow(null),
  floor: Joi.string().optional().allow('').allow(null),
  city: Joi.string().required(),
  state: Joi.string().required(),
  country: Joi.string().required(),
  zipCode: Joi.string().optional().allow('').allow(null),
});

export const CreatePaymentDTOSchema = Joi.object({
  userId: Joi.string().optional().allow('').allow(null),
  userName: Joi.string().required(),
  userEmail: Joi.string().email().required(),
  userPhone: Joi.string().required(),

  paymentMethod: Joi.string()
    .valid(...Object.values(PaymentMethod))
    .required(),
  provider: Joi.string()

    .when('paymentMethod', {
      is: PaymentMethod.CARD,
      then: Joi.valid(
        PaymentProvider.STRIPE,
        PaymentProvider.TABBY,
        PaymentProvider.TAMARA
      ),
      otherwise: Joi.string().when('paymentMethod', {
        is: PaymentMethod.INSTALLMENTS,
        then: Joi.string().valid(PaymentProvider.TABBY, PaymentProvider.TAMARA),
        otherwise: Joi.string().when('paymentMethod', {
          is: PaymentMethod.COD,
          then: Joi.string().valid(PaymentProvider.COD),
        }),
      }),
    })
    .required(),

  providerPaymentId: Joi.string().optional().allow('').allow(null),

  orderId: Joi.string().optional().allow('').allow(null),

  totalAmount: Joi.number().positive().required(),
  discount: Joi.number().min(0).required(),
  currency: Joi.string().required(),

  orderItems: Joi.array().items(OrderItemDTOSchema).required(),
  shippingAddress: ShippingAddressDTOSchema.required(),
});

export default function validateCreatePaymentDTO(
  data: unknown,
  options: Joi.AsyncValidationOptions = { abortEarly: false }
) {
  return CreatePaymentDTOSchema.validateAsync(data, options);
}
