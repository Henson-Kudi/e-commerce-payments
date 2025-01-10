import paymentService from '../../../application/services';
import { Payment } from '../../../domain/entities';
import { IReturnValueWithPagination } from '../../../domain/valueObjects/returnValue';
import RequestObject from '../../../utils/types/requestObject';
import IContoller from './Icontroller';

export class CreatePaymentController implements IContoller {
    handle(request: RequestObject): Promise<IReturnValueWithPagination<Payment>> {

        return paymentService.getPayments({
            filter: { ...(request?.query?.filter ?? {}) },
            options: {
                withInstallments: request.query?.options?.withInstallments === 'true',
                limit: Number(request.query?.options?.limit ?? 10),
                page: Number(request.query?.options?.page ?? 1),
                withOrder: request.query?.options?.withOrder === 'true',
            }
        });

    }
}

export default new CreatePaymentController();
