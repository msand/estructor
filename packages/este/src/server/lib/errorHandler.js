// @flow
import config from '../config';

const errorHandler = (err: any, req: any, res: any) => {
  const errorDetails = err.stack || err;

  console.error('Yay', errorDetails);

  res.status(500).format({
    json() {
      const errorInfo = {
        details: config.isProduction ? null : errorDetails,
        error: err.toString(),
      };
      res.send(errorInfo);
    },

    html() {
      const message = config.isProduction
        ? '<p>Something went wrong</p>'
        : `<pre>${errorDetails}</pre>`;

      res.send(`<h1>500 Internal server error</h1>\n${message}`);
    },

    default() {
      const message = config.isProduction
        ? 'Something went wrong'
        : `${errorDetails}`;

      res.send(`500 Internal server error:\n${message}`);
    },
  });
};

export default errorHandler;
