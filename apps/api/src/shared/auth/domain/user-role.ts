export const UserRole = {
  User: 'user',
  Admin: 'admin',
} as const;

export type UserRole = (typeof UserRole)[keyof typeof UserRole];

const AllUserRoles = Object.values(UserRole);

export function isUserRole(role: string): role is UserRole {
  return (AllUserRoles as string[]).includes(role);
}
