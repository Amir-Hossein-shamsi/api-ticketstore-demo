import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
import cookieSession from 'cookie-session';
import { config as dotenv } from 'dotenv';
import { routersOfusers } from './routes/auth-routes';
import { errorHandler } from './middleware/error-handler';
import { NotFoundError } from './errors/not-found-error';

const app = express();
app.set('trust proxy', true);
dotenv();
app.use(
  cookieSession({
    signed: false,
    secure: false,
  })
);
app.use(json());
app.use(routersOfusers);

app.all('*', async () => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
