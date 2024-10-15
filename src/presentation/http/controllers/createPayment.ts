import paymentService from '../../../application/services';
import { IReturnValue } from '../../../domain/valueObjects/returnValue';
import validateCreatePaymentDTO from '../../../utils/joi';
import RequestObject from '../../../utils/types/requestObject';
import IContoller from './Icontroller';

export class CreatePaymentController implements IContoller {
  async handle(request: RequestObject): Promise<IReturnValue<unknown>> {
    await validateCreatePaymentDTO(request.body);

    const result = await paymentService.createPayment(request.body.provider, {
      ...request.body,
      userId: request.headers?.userId,
    });

    return {
      success: true,
      data: result,
      message: 'Payment created successfully',
    };
  }
}

export default new CreatePaymentController();
