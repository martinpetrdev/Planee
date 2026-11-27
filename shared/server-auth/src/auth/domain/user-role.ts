export enum UserRole {
	User = "user",
	Admin = "admin",
}

export function isUserRole(role: string) {
	return Object.values(UserRole).includes(role as UserRole);
}
