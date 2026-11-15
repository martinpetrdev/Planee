export abstract class UserProvisioningPort {
  abstract ensureProvisioned(id: string): Promise<void>;
}
