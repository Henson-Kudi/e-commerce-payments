import ErrorClass from './error';

export interface IReturnValue<Data = unknown> {
  success: boolean;
  message?: string;
  data?: Data;
  error?: ErrorClass;
}

export class IReturnValueWithPagination<Data = unknown> {
  constructor(
    public success: boolean,
    public message?: string,
    public data?: {
      data: Array<Data>;
      limit: number;
      total: number;
      page: number;
    },
    public error?: ErrorClass
  ) { }
}