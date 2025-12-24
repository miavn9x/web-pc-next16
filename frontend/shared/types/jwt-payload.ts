export type JwtPayload = {
  sessionId: string;
  sub: string;
  name: string;
  email: string;
  isEmailVerified: boolean;
  roles: string[];
  iat?: number;
  exp?: number;
};
