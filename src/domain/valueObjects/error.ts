import { ResponseCodes } from '../enums/responseCode';

const ErrorNames = {
  ['400']: 'BadRequest',
  ['401']: 'UnAuthorised',
  ['403']: 'Forbidden',
  ['404']: 'NotFound',
  ['408']: 'RequestTimeOutError',
  ['422']: 'ValidationError',
  ['300']: 'Redirect',
  ['500']: 'ServerError',
  ['502']: 'GatewayTimeOut',
  ['503']: 'ServerDown',
  ['201']: 'Success',
} as const;

export default class ErrorClass extends Error {
  constructor(
    message: string,
    public code: ResponseCodes,
    public data?: unknown
  ) {
    super(message);
    this.name = ErrorNames[code] ?? 'Error';

    // Capture stack trace
    this.stack = this.stack ?? new Error(message).stack;
  }

  // Call toJSON to get valid json to send to frontend or to send response
  toJSON() {
    return {
      message: this.message,
      code: this.code,
      data: this?.data,
      name: this.name,
    };
  }
}
