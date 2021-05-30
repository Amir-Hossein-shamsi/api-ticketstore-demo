import express, { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import jwt from 'jsonwebtoken';
import { User } from '../models/user';
import { currentUser, requireAuth } from '../middleware/current-user';
import { RequestValidationError } from '../errors/request-validation-error';
import { validationRequest } from '../middleware/validate-handller';
import { DatabaseConnectionError } from '../errors/database-connection-errors';
import { BadRequestError } from '../errors/badrequesterror';
const router = express.Router();

const validation_conditions = [
  body('name').notEmpty().withMessage('name is required'),
  body('email').isEmail().withMessage('Email must be valid'),
  body('password')
    .trim()
    .isLength({ min: 8 })
    .withMessage('Password must be more than 8 characters'),
];

router.post(
  '/api/users/signup',
  validation_conditions,
  validationRequest,
  async (req: Request, res: Response) => {
    //throw new DatabaseConnectionError();
    const { name, email, password, isAdmin } = req.body;
    const exitingOne = await User.findOne({ email });
    if (exitingOne) {
      throw new BadRequestError('Email in use', 400);
      // throw new Error('this email address has been tacken');
    }
    // console.log('Creating a user...');
    const newUser = User.creating({ name, email, password, isAdmin });
    await newUser.save();

    const userjwt = jwt.sign(
      {
        id: newUser.id,
        email: newUser.email,
        isAdmin: newUser.isAdmin,
      },
      process.env.KEY_COOKIE!
    );
    req.session = {
      jwt: userjwt,
    };

    res.status(201).send(newUser);
  }
);

router.post('/api/users/signin', async (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new BadRequestError('plz enter your email and password ', 400);
  }
  const user = await User.credential(email, password);
  const userjwt = jwt.sign(
    {
      id: user.id,
      email: user.email,
      isAdmin: user.isAdmin,
    },
    process.env.KEY_COOKIE!
  );
  req.session = {
    jwt: userjwt,
  };

  res.status(200).send(user);
});

router.get(
  '/api/users/currentuser',
  currentUser,
  requireAuth,
  async (req, res) => {
    res.send({ currentUser: req.currentuser || null });
  }
);

router.post('/api/users/signout', async (req: Request, res: Response) => {
  req.session = null;
  res.send({});
});

export { router as routersOfusers };
