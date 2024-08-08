import RequestObject from '../../../utils/types/requestObject';

export default interface IContoller<T = unknown> {
  handle(request: RequestObject): Promise<T>;
}
