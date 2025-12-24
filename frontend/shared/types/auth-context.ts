import { JwtPayload } from "./jwt-payload";

export type AuthContextType = {
  user: JwtPayload | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  setUser: (_user: JwtPayload | null) => void;
};
