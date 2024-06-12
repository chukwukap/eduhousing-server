export interface JwtPayload {
  [key: string]: any;
  userId?: string;
  email?: string;
  role?: string;
}
