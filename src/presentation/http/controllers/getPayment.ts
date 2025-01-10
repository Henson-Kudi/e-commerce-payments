import paymentService from '../../../application/services';
import { Payment } from '../../../domain/entities';
import { ResponseCodes } from '../../../domain/enums/responseCode';
import ErrorClass from '../../../domain/valueObjects/error';
import { IReturnValue } from '../../../domain/valueObjects/returnValue';
import RequestObject from '../../../utils/types/requestObject';
import IContoller from './Icontroller';

export class CreatePaymentController implements IContoller {
    handle(request: RequestObject): Promise<IReturnValue<Payment | null>> {

        if (!request.params.id) {
            return Promise.resolve({ success: false, error: new ErrorClass('Invalid payment id', ResponseCodes.BadRequest, null), data: null })
        }

        return paymentService.getPayment({
            id: request.params.id,
            userId: request.headers?.['user-id'] || request.headers?.['userid'],
            withInstallments: request.query.withInstallments === 'true' || false
        })

    }
}

export default new CreatePaymentController();
