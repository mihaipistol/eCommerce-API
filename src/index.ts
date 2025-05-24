import express, { Request, Response } from 'express';
import configureCors from './middleware/cors';
import consfigureSecurityHeaders from './middleware/securityHeaders';
import authenticationRouter from './route/authentication/router';
import ordersRouter from './route/orders/router';
import passwordsRouter from './route/passwords/router';
import productsRouter from './route/products/router';
import usersRouter from './route/users/router';

if (!process.env.EXPRESS_PORT) {
  console.error('PORT Value must be set in the environment variables');
  throw new Error('PORT Value must be set in the environment variables');
}
const port = process.env.EXPRESS_PORT;

const app = express();

// Middleware to log requests
app.use((req: Request, res: Response, next: () => void) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// Middleware to parse JSON bodies
app.use(express.json());

// Middleware to parse URL-encoded bodies
app.use(express.urlencoded({ extended: true }));

// Middleware to set security headers
app.use(consfigureSecurityHeaders);

// Middleware to handle CORS
app.use(configureCors);

// Middleware to handle static files
app.use(express.static('public'));

// Root endpoint to check if the API is online
app.get('/', (req: Request, res: Response) => {
  res.send('API is online!');
});

// Import and use routers
app.use('/authentication', authenticationRouter);
app.use('/orders', ordersRouter);
app.use('/passwords', passwordsRouter);
app.use('/products', productsRouter);
app.use('/users', usersRouter);

// Middleware to handle 404 errors
app.use((req: Request, res: Response) => {
  res.status(404).json({ error: 'Not Found' });
});

// Middleware to handle 500 errors
app.use((err: Error, req: Request, res: Response) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
});

// Middleware to handle uncaught exceptions
process.on('uncaughtException', (err: Error) => {
  console.error('Uncaught Exception:', err);
  // Handle the error (e.g., log it, send an alert, etc.)
});

// I found mentions that this might not be neded in express 5, but keeping it for safety
// Might reemove it in the future if confirmed,
// Middleware to handle unhandled promise rejections
process.on('unhandledRejection', (reason: any, promise: Promise<any>) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  // Handle the error (e.g., log it, send an alert, etc.)
});

// Middleware to handle SIGINT (Ctrl+C)
process.on('SIGINT', () => {
  console.log('SIGINT received. Shutting down gracefully...');
  // Perform any cleanup tasks here (e.g., close database connections)
  process.exit(0);
});
// Middleware to handle SIGTERM (kill command)
process.on('SIGTERM', () => {
  console.log('SIGTERM received. Shutting down gracefully...');
  // Perform any cleanup tasks here (e.g., close database connections)
  process.exit(0);
});
// Middleware to handle SIGUSR2 (nodemon restart)
process.on('SIGUSR2', () => {
  console.log('SIGUSR2 received. Restarting gracefully...');
  // Perform any cleanup tasks here (e.g., close database connections)
  process.exit(0);
});
// Middleware to handle SIGHUP (terminal hangup)
process.on('SIGHUP', () => {
  console.log('SIGHUP received. Shutting down gracefully...');
  // Perform any cleanup tasks here (e.g., close database connections)
  process.exit(0);
});
// Middleware to handle SIGQUIT (Ctrl+\)
process.on('SIGQUIT', () => {
  console.log('SIGQUIT received. Shutting down gracefully...');
  // Perform any cleanup tasks here (e.g., close database connections)
  process.exit(0);
});
// Middleware to handle SIGBREAK (Windows Ctrl+Break)
process.on('SIGBREAK', () => {
  console.log('SIGBREAK received. Shutting down gracefully...');
  // Perform any cleanup tasks here (e.g., close database connections)
  process.exit(0);
});
// Middleware to handle SIGCONT (continue)
process.on('SIGCONT', () => {
  console.log('SIGCONT received. Continuing gracefully...');
  // Perform any tasks here (e.g., resume operations)
  // Note: This signal is not typically used in Node.js applications
  // but can be handled if needed.
  // process.exit(0);
});

// Start the server
app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
