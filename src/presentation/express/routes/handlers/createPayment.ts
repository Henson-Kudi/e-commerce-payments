import { NextFunction, Request, Response } from 'express';
import expressAdapter from '../../../adapters/expressAdapter';
import createPaymentController from '../../../http/controllers/createPayment';
import { ResponseCodes } from '../../../../domain/enums/responseCode';

export default async function handleCreatePayment(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const result = await expressAdapter(req, createPaymentController);

    if (!result.success || result.error) {
      throw (
        result.error || new Error('An error occurred while creating payment')
      );
    }

    return res.status(ResponseCodes.Success).json(result);
  } catch (error) {
    next(error);
  }
}
