export type UserRole = "USER" | "ADMIN";
export enum UserStatus {
  ACTIVE = 'ACTIVE',
  BLOCKED = 'BLOCKED',
}

// types/user.ts
export type StatusKey = 'ALL' | keyof typeof UserStatus;

export interface UserResponse {
  id: number;
  username: string;
  fullName: string;
  email: string;
  role: UserRole;
  status: UserStatus;
}

export interface UpdateUserRequest {
  name: string;
  phone: string;
  email: string;
  address: string;
  password?: string;
}

export interface ChangeStatusUserRequest {
  status: UserStatus;
}
export interface UserSearchParams { 
  page?: number; 
  size?: number; 
  sort?: string; 
  name?: string; 
  status?: StatusKey;
}