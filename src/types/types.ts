export enum JwtSub {
  API = 'api',
  REFRESH = 'refresh',
}

export enum UserRole {
  ADMIN = 'admin',
  SELLER = 'seller',
  USER = 'user',
}

export enum UserStatus {
  PENDING = 'pending',
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  BANNED = 'banned',
  DELETED = 'deleted',
}

export enum OrderStatus {
  NEW = 'new',
  PENDING = 'pending',
  DELIVERD = 'deliverd',
}

export type JwtUser = {
  id: number;
  email: string;
  role: UserRole;
};
