// Change this file to handle errors as you would like
import { ErrorRequestHandler } from 'express';
import logger from '../../../utils/logger';
import { ResponseCodes } from '../../../domain/enums/responseCode';
import Joi from 'joi';
import ErrorClass from '../../../domain/valueObjects/error';
import { Prisma } from '@prisma/client';
import Stripe from 'stripe';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const errorRequestHandler: ErrorRequestHandler = (err, req, res, next) => {
  logger.error((err as Error).message, err);

  if (Joi.isError(err)) {
    return res.status(ResponseCodes.ValidationError).json({
      message: err.message,
      details: err.details,
    });
  }

  if (err instanceof ErrorClass) {
    const errorData = err.toJSON();
    return res.status(errorData.code).json(errorData);
  }

  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    // The .code property can be used to identify the err
    if (err.code === 'P2002') {
      // P2002 is a unique constraint violation
      logger.error(`There is a unique constraint violation!`, err);
      return res.status(ResponseCodes.BadRequest).json({
        message: 'There is a unique constraint violation!',
        error: err,
      });
    } else {
      logger.error(`Prisma known request err: ${err.message}`, err);
      return res.status(ResponseCodes.BadRequest).json({
        message: err.message,
        error: err,
      });
    }
  }

  if (err instanceof Prisma.PrismaClientUnknownRequestError) {
    logger.error('Prisma unknown request err:', err.message);
    return res.status(ResponseCodes.BadRequest).json({
      message: err.message,
      error: err,
    });
  }

  if (err instanceof Prisma.PrismaClientRustPanicError) {
    logger.error('Prisma client rust panic err:', err.message);
    return res.status(ResponseCodes.BadRequest).json({
      message: err.message,
      error: err,
    });
  }

  if (err instanceof Prisma.PrismaClientInitializationError) {
    logger.error('Prisma client initialization err:', err.message);
    return res.status(ResponseCodes.BadRequest).json({
      message: err.message,
      error: err,
    });
  }

  if (err instanceof Stripe.errors.StripeError) {
    logger.error('Stripe error:', err.message);

    return res.status(ResponseCodes.BadRequest).json({
      message: err.message,
      error: err,
    });
  }

  const error = err as Error;

  return res
    .status(ResponseCodes.ServerError)
    .json({ message: error.message, error });
};

export default errorRequestHandler;
