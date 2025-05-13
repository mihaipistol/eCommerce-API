export enum UserRole {
  ADMIN = 'admin',
  SELLER = 'seller',
  USER = 'user',
  GUEST = 'guest',
}

export enum UserStatus {
  PENDING = 'pending',
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  BANNED = 'banned',
  DELETED = 'deleted',
}

export type JwtUser = {
  id: number;
  role: UserRole;
};
