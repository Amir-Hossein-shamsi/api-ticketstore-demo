import { CustomError } from './custom-error';

export class BadRequestError extends CustomError {
  constructor(private resone: string, private code: number) {
    super(resone);

    Object.setPrototypeOf(this, BadRequestError.prototype);
  }
  statusCode = this.code;

  serializeErrors() {
    return [{ message: this.resone }];
  }
}
