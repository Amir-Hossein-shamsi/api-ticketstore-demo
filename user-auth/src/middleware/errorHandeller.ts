import { Request, NextFunction, Response } from 'express';
import { CustomError } from '../errors/CustomError';
const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof CustomError) {
    return res.status(err.statusCode).send({ errors: err.serializeErrors() });
  }
  return res.status(500).send({ error: err.message });
};

export default errorHandler;
