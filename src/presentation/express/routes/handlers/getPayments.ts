import { NextFunction, Request, Response } from 'express';
import expressAdapter from '../../../adapters/expressAdapter';
import { ResponseCodes } from '../../../../domain/enums/responseCode';
import getPayments from '../../../http/controllers/getPayments';
import ErrorClass from '../../../../domain/valueObjects/error';

export default async function handleGetPayments(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        const result = await expressAdapter(req, getPayments);

        if (!result.success || result.error) {
            throw (
                result.error || new ErrorClass('An error occurred while fetching payments', ResponseCodes.ServerError)
            );
        }

        return res.status(ResponseCodes.Success).json(result);
    } catch (error) {
        next(error);
    }
}
