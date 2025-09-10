export interface AdminUser {
  _id?: string;
  username: string;
  email: string;
  passwordHash: string;
  role?: "admin" | "super_admin";
  createdAt?: Date;
  updatedAt?: Date;
  lastLogin?: Date;
}

export interface AdminSession {
  _id?: string;
  adminId: string;
  token: string;
  expiresAt: Date;
  createdAt: Date;
}

export interface LoginCredentials {
  username: string;
  password: string;
}
