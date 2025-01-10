import { NextFunction, Request, Response } from 'express';
import expressAdapter from '../../../adapters/expressAdapter';
import { ResponseCodes } from '../../../../domain/enums/responseCode';
import getPayment from '../../../http/controllers/getPayment';
import ErrorClass from '../../../../domain/valueObjects/error';

export default async function handleGetPayment(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        const result = await expressAdapter(req, getPayment);

        if (!result.success || result.error) {
            throw (
                result.error || new ErrorClass('An error occurred while fetching payment', ResponseCodes.ServerError)
            );
        }

        return res.status(ResponseCodes.Success).json(result);
    } catch (error) {
        next(error);
    }
}
