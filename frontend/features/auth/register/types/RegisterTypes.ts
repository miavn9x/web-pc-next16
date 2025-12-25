export type RegisterPayload = {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  address?: string;
  captchaId: string;
  captchaCode: string;
};

export type RegisterResponse = {
  message: string;
  data: {
    accessToken?: string;
    refreshToken?: string;
  } | null;
  errorCode: string | null;
};
