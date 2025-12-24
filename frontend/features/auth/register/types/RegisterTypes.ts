export type RegisterPayload = {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
};

export type RegisterResponse = {
  message: string;
  data: {
    accessToken?: string;
    refreshToken?: string;
  } | null;
  errorCode: string | null;
};
