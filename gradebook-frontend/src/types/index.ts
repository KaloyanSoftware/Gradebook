export type Role = 'ADMIN' | 'PARENT' | 'STUDENT';

export interface AppUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: Role;
}
