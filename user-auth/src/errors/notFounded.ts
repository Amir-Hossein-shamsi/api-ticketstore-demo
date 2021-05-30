import { CustomError } from './CustomError';
export class NotFoundError extends CustomError {
  statusCode = 404;
  constructor() {
    super('page not founded');
    Object.setPrototypeOf(this, NotFoundError.prototype);
  }
  serializeErrors() {
    return [{ message: 'NOt founded Page' }];
  }
}
