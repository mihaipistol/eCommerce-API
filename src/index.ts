import express, { Request, Response } from 'express';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import getEnvironment from './lib/environment';
import options from './lib/swagger';
import authenticationRouter from './route/authentication/router';
import ordersRouter from './route/orders/router';
import passwordsRouter from './route/passwords/router';
import productsRouter from './route/products/router';
import tagsRouter from './route/tags/router';
import usersRouter from './route/users/router';

getEnvironment().then((env) => {
  const app = express();

  // Middleware to log requests
  app.use((req: Request, res: Response, next: () => void) => {
    console.log(`${req.method} ${req.url}`);
    next();
  });

  // Middleware to handle errors
  app.use((err: Error, req: Request, res: Response, next: () => void) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Internal Server Error' });
  });

  // Middleware to parse JSON bodies
  app.use(express.json());

  // Middleware to parse URL-encoded bodies
  app.use(express.urlencoded({ extended: true }));

  // Middleware to set security headers
  app.use((req: Request, res: Response, next: () => void) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    next();
  });

  // Middleware to handle CORS
  app.use((req: Request, res: Response, next: () => void) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader(
      'Access-Control-Allow-Headers',
      'Origin, X-Requested-With, Content-Type, Accept',
    );
    res.setHeader(
      'Access-Control-Allow-Methods',
      'GET, POST, PUT, DELETE, OPTIONS',
    );
    if (req.method === 'OPTIONS') {
      res.status(200);
    }
    next();
  });

  app.get('/', (req: Request, res: Response) => {
    res.send('API is online!');
  });

  app.get('/health', async (req: Request, res: Response) => {
    res.status(200).json({ status: 'OK' });
  });

  app.use('/authentication', authenticationRouter);
  app.use('/orders', ordersRouter);
  app.use('/passwords', passwordsRouter);
  app.use('/products', productsRouter);
  app.use('/tags', tagsRouter);
  app.use('/users', usersRouter);

  const specs = swaggerJSDoc(options);
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

  // Middleware to handle 404 errors
  app.use((req: Request, res: Response) => {
    res.status(404).json({ error: 'Not Found' });
  });

  app.listen(env.EXPRESS_PORT, () => {
    console.log(`App listening on port ${env.EXPRESS_PORT}`);
  });
});
