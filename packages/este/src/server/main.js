// @flow
import config from './config';
import errorHandler from './lib/errorHandler';
import express from 'express';
import frontend from './frontend';
import 'isomorphic-fetch';

const app = express();

app.use(frontend);
app.get('*', errorHandler);

app.listen(config.port, () => {
  console.log(`Server started at http://localhost:${config.port}`);
});
