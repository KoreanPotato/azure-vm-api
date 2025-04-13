import { Injectable } from '@nestjs/common';
import { SecretClient } from '@azure/keyvault-secrets';
import { ClientSecretCredential } from '@azure/identity';

@Injectable()
export class AzureAuthService {
  private credential: ClientSecretCredential;
  private subscriptionId: string;

  async init(): Promise<void> {
    const tempCredential = new ClientSecretCredential(
// get data from env once
      process.env.AZURE_TENANT_ID!,
      process.env.AZURE_CLIENT_ID!,
      process.env.AZURE_CLIENT_SECRET!,
    );

    const keyVaultName = 'myNestKeyVault';
    const url = `https://${keyVaultName}.vault.azure.net`;
    const keyVaultClient = new SecretClient(url, tempCredential);

    const clientId = await keyVaultClient.getSecret('azure-client-id');
    const clientSecret = await keyVaultClient.getSecret('azure-client-secret');
    const tenantId = await keyVaultClient.getSecret('azure-tenant-id');
    const subscriptionId = await keyVaultClient.getSecret('azure-subscription-id');

    this.credential = new ClientSecretCredential(
      tenantId.value!,
      clientId.value!,
      clientSecret.value!,
    );

    this.subscriptionId = subscriptionId.value!;
  }

  getCredential(): ClientSecretCredential {
    return this.credential;
  }

  getSubscriptionId(): string {
    return this.subscriptionId;
  }
}
