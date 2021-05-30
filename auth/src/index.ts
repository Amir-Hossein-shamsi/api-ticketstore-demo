import mongoose from 'mongoose';
import { app } from './app';

let port = process.env.PORT || 3000;
const stratServerandDataBase = async () => {
  try {
    await mongoose.connect(<string>process.env.DATABESE_URL, {
      useCreateIndex: true,
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('db is connected');
  } catch (error) {
    console.error(error);
  }

  app.listen(port, () => {
    console.log(`listening on port ${port} !!!!!!`);
  });
};
stratServerandDataBase();
