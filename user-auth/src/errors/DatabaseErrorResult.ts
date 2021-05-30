import { CustomError } from './CustomError';

export class DatabaseErrorResult extends CustomError {
  statusCode = 500;
  resone = 'Database has a little promble !';

  constructor() {
    super('Error connecting to db');

    Object.setPrototypeOf(this, DatabaseErrorResult.prototype);
    //console.log(typeof DatabaseErrorResult.prototype.message);
  }
  serializeErrors() {
    return [{ message: this.resone }];
  }
}
