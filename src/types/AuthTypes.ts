export interface RegisterRequestI {
  displayName: string;
  playerTag: string;
  email: string;
  username: string;
  password: string;
}

export interface LoginRequestI {
  usernameEmail: string;
  password: string;
}

export interface TokenFormatI {
  username: string;
  role: string;
  id: string;
  email: string;
  displayName: string;
  playerTag: string;
  refreshToken: string;
}
