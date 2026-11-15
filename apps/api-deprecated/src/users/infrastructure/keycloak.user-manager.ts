import axios, { AxiosInstance } from 'axios';

import { UserManagerPort } from '../domain/ports/user-manager.port.js';

export class KeycloakUserManager extends UserManagerPort {
  private readonly keycloakConnector: AxiosInstance;
  private readonly keycloakAdminConnector: AxiosInstance;

  constructor(
    private readonly issuer: string,
    private readonly clientId: string,
    private readonly clientSecret: string,
  ) {
    super();

    this.keycloakConnector = axios.create({
      baseURL: issuer,
    });

    const adminUrl = new URL(this.issuer);
    adminUrl.pathname =
      '/admin' +
      (adminUrl.pathname.startsWith('/')
        ? adminUrl.pathname
        : `/${adminUrl.pathname}`);
    this.keycloakAdminConnector = axios.create({
      baseURL: adminUrl.href,
    });
  }

  async inviteIntoTenant(props: { tenantName: string; email: string }) {
    const tenantId = await this.getTenantId(props.tenantName);
    const serviceToken = await this.getServiceAccessToken();

    const headers = { Authorization: `Bearer ${serviceToken}` };

    await this.keycloakAdminConnector
      .post(
        `/organizations/${tenantId}/members/invite-user`,
        `email=${encodeURIComponent(props.email)}`,
        {
          headers: {
            ...headers,
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        },
      )
      .catch(async (error) => {
        // Written by AI (Claude Opus 5.5)
        if (!axios.isAxiosError(error) || error.response?.status !== 409) {
          return;
        }

        // Invitation already exists -> resend it
        const { data: invitations } = await this.keycloakAdminConnector.get(
          `/organizations/${tenantId}/invitations`,
          { headers, params: { email: props.email } },
        );
        const invitation = invitations?.find(
          (i: { email: string }) =>
            i.email.toLowerCase() === props.email.toLowerCase(),
        );
        if (invitation) {
          await this.keycloakAdminConnector.post(
            `/organizations/${tenantId}/invitations/${invitation.id}/resend`,
            undefined,
            { headers },
          );
        }
      });
  }

  private async getServiceAccessToken(): Promise<string> {
    const { data } = await this.keycloakConnector.post(
      '/protocol/openid-connect/token',
      `grant_type=client_credentials&` +
        `client_id=${this.clientId}&` +
        `client_secret=${this.clientSecret}`,
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      },
    );

    return data?.access_token;
  }

  private async getTenantId(tenantName: string): Promise<string> {
    const serviceToken = await this.getServiceAccessToken();

    const { data } = await this.keycloakAdminConnector.get(
      `/organizations?search=${tenantName}`,
      {
        headers: {
          Authorization: `Bearer ${serviceToken}`,
        },
      },
    );

    return data?.[0]?.id;
  }
}
