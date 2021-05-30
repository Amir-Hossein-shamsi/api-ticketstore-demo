import { CustomError } from './CustomError';
import { ValidationError } from 'express-validator';

export class ValidationErrorsResult extends CustomError {
  statusCode = 400;

  constructor(private errors: ValidationError[]) {
    super('Invalid request parameters');

    Object.setPrototypeOf(this, ValidationErrorsResult.prototype);
  }
  serializeErrors() {
    return this.errors.map((err) => {
      return { message: err.msg, field: err.param };
    });
  }
}
