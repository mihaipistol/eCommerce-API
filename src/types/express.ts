import { JwtUser } from './types';

declare global {
  namespace Express {
    interface Request {
      user?: JwtUser;
    }
  }
}
