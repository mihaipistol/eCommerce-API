import express, { Request, Response } from 'express';

import productsRouter from './route/product/router';

const app = express();
const port = 3000;

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
  res.send('Hello World!');
});

app.use('/products', productsRouter);

// Middleware to handle 404 errors
app.use((req: Request, res: Response) => {
  res.status(404).json({ error: 'Not Found' });
});

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
