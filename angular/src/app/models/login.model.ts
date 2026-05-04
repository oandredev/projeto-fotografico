export interface Login {
  email: string;
  senha: string;
  rememberMe: boolean;
}

export interface TokenResponse {
  token: string;
}
