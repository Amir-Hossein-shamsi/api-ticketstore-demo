import express, { Response, Request } from 'express';
import { validationResult, body } from 'express-validator';
import { ValidationErrorsResult } from '../errors/validationErrorResult';
import { DatabaseErrorResult } from '../errors/DatabaseErrorResult';

const router = express.Router();

const validate_condition = [
  body('email').isEmail().withMessage('Email must be valid'),
  body('password')
    .trim()
    .isLength({ min: 8 })
    .withMessage('Password must be more than 8 characters'),
];

router.post(
  '/api/users/signup',
  validate_condition,
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new ValidationErrorsResult(errors.array());
    }
    throw new DatabaseErrorResult();
    // res.send('hello');
  }
);

router.post('/api/users/signin', async (req: Request, res: Response) => {
  res.send('Hi there!');
});

export { router as router_user };
