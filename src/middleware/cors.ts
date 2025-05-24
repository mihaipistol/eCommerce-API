import { Request, Response } from 'express';

export default function configureCors(
  req: Request,
  res: Response,
  next: () => void,
) {
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
}
