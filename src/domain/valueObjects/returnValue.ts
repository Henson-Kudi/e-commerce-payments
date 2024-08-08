import ErrorClass from './error';

export interface IReturnValue<Data = unknown> {
  success: boolean;
  message?: string;
  data?: Data;
  error?: ErrorClass;
}
