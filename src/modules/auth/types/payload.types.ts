export interface IPayload {
  sub: string;
  email: string;
}

export interface IRefreshPayload extends IPayload {
  refreshToken: string;
}
