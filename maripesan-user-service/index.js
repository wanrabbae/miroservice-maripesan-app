import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import error from 'http-errors';
import * as routes from './routes/index.js';

const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(morgan('dev'));
app.use(cors());

app.get('/', async (req, res) => {
  res.send({
    status: 'success',
    message: `User Service API`,
  });
});

app.use('/v1', routes.v1);

app.use((req, res, next) => {
  next(error.NotFound());
});

app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.send({
    status: err.status || 500,
    message: err.message,
  });
});

app.listen(port, () => console.log(`Server started on port ${port}`));
