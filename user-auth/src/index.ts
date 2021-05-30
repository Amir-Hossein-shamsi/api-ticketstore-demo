import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
import { router_user } from './routes/routers-user';
import { NotFoundError } from './errors/notFounded';
import errohandeller from './middleware/errorHandeller';

const app = express();
app.use(json());

app.use(router_user);
app.all('*', async () => {
  throw new NotFoundError();
});
app.use(errohandeller);

const port = 3000 || process.env;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
