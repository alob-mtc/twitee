import express from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import cors from 'cors';
import morgan from 'morgan';
import router from './routers';

dotenv.config();

const apiRoot = process.env.DM_API_ROOT;
const app = express();
//cors config
app.use(cors());
// config logging
app.use(morgan('dev'));
app.use(bodyParser.json());
// TODO: figure out DNT compliance.
app.use((_, res, next) => {
  res.set({ Tk: '!' });
  next();
});
// config router
router(app);

export default app;