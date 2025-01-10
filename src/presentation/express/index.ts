import 'dotenv/config';
import express, { NextFunction, Request, Response } from 'express';
import cors from 'cors';
import { Server } from 'http';
import router from './routes';
import errorRequestHandler from './middlewares/errorHandler';
import envConf from '../../env.conf';
import logger from '../../utils/logger';

const app = express();

const PORT = envConf.PORT;

const baseUrl = '/api/v1/payments-service'; // change as you like

app.use(
  cors({
    origin: (req, cb) => cb(null, true), //Manage cors as you want
  })
);


const rawBodyMiddleware = (req: Request, res: Response, next: NextFunction) => {
  if (req.originalUrl === '/api/v1/payments-service/webhook/stripe') {
    next();
  } else {
    // For all other routes, use regular json middleware
    express.json()(req, res, next);
  }
};

app.use(rawBodyMiddleware)

// Add morgan for dev api route logging only
if (envConf.NODE_ENV !== 'production') {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  app.use(require('morgan')('dev')); // morgan for api route logging
}


//
app.use(`${baseUrl}`, router);

// Attach error handler only attach all other route handlers
app.use(errorRequestHandler);

export default function startExpressServer(): {
  server: Server;
  app: express.Application;
} {
  const server = app.listen(PORT, () => {
    // Better to use a logger instead of just logging to console
    logger.info(`Server running on: http://localhost:${PORT}`);
  });

  return {
    server,
    app,
  };
}
