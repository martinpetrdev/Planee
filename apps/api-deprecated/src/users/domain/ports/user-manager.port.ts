export abstract class UserManagerPort {
  abstract inviteIntoTenant(props: {
    tenantName: string;
    email: string;
  }): Promise<void>;
}
