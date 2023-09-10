export interface UserState {
  id: string;
  username: string;
  phone?: string;
  avatar?: string;
  description?: string;
  permissions: Array<string>;
  roles: Array<string>;
  is_super_admin?: number;
}
