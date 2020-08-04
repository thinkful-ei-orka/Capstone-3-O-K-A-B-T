require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const { NODE_ENV } = require('./config');
const loginRouter = require('./auth/auth-router');
const errorHandler = require('./middleware/error-handler');
const userRouter = require('./user/user-router');

const app = express();

app.use(morgan((NODE_ENV === 'production') ? 'tiny' : 'common', {
  skip: () => NODE_ENV === 'test',
}));
app.use(helmet());
app.use(cors());

app.use('/api/auth', loginRouter);
app.use('/api/user', userRouter);
//app.use('/api/blessings', blessingsRouter);
//app.use('/api/curses', curseRouter);
//app.use('/api/quotes', quoteRouter);

app.use(errorHandler);

module.exports = app;