export type UserRole = "USER" | "ADMIN";

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  userId: number;
  username: string;
  role: UserRole; // "USER", "ADMIN"
}

export interface UserRegisterRequest {
  fullName: string;
  username: string;
  email: string;
  password: string;
}

// Request để đăng nhập
export interface UserLoginRequest {
  username: string;
  password: string;
}

// Request để refresh access token
export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface UserRefreshRequest {
  refreshToken: string;
}