declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

export interface JwtPayload {
  [key: string]: any;
  userId?: string;
  email?: string;
  role?: string;
}

export {};
