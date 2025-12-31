import { UserDocument } from '../../users/schemas/user.schema';

export const generateJwtPayload = (user: UserDocument, sessionId: string) => ({
  sub: user._id.toString(),
  sessionId,
  email: user.email,
  roles: user.roles,
});
