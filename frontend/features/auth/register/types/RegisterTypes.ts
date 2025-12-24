export type RegisterPayload = {
  email: string;
  password: string;
};

export type RegisterResponse = {
  message: string;
  data: {
    accessToken?: string;
    refreshToken?: string;
  } | null;
  errorCode: string | null;
};
