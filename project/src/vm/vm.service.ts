import { Injectable, OnModuleInit } from '@nestjs/common';
import { NetworkManagementClient } from '@azure/arm-network';
import { ComputeManagementClient } from '@azure/arm-compute';
import { AzureAuthService } from '../azure/azure-auth.service';
import {
  AZURE_REGION,
  AZURE_RG,
  AZURE_VNET,
  AZURE_SUBNET,
} from '../azure/azure.constants';

@Injectable()
export class VmService implements OnModuleInit {
  private networkClient: NetworkManagementClient;
  private computeClient: ComputeManagementClient;

  constructor(private readonly azureAuthService: AzureAuthService) {}

  async onModuleInit() {
    await this.azureAuthService.init();

    const credential = this.azureAuthService.getCredential();
    const subscriptionId = this.azureAuthService.getSubscriptionId();

    this.networkClient = new NetworkManagementClient(credential, subscriptionId);
    this.computeClient = new ComputeManagementClient(credential, subscriptionId);
  }

  async createNic(nicName: string, publicIpId: string): Promise<string> {
    const subnet = await this.networkClient.subnets.get(
      AZURE_RG,
      AZURE_VNET,
      AZURE_SUBNET,
    );
  
    const nic = await this.networkClient.networkInterfaces.beginCreateOrUpdateAndWait(
      AZURE_RG,
      nicName,
      {
        location: AZURE_REGION,
        ipConfigurations: [
          {
            name: 'nicConfig',
            subnet: { id: subnet.id },
            publicIPAddress: { id: publicIpId },
            privateIPAllocationMethod: 'Dynamic',
          },
        ],
      },
    );
  
    return nic.id!;
  }
  


  async createPublicIp(publicIpName: string): Promise<string> {
    const result = await this.networkClient.publicIPAddresses.beginCreateOrUpdateAndWait(
      AZURE_RG,
      publicIpName,
      {
        location: AZURE_REGION,
        publicIPAllocationMethod: 'Dynamic',
        sku: {
          name: 'Basic',
        },
      },
    );
  
    return result.id!;
  }

  async createVm(vmName: string, nicId: string, sshPublicKey: string) {
    const vm = await this.computeClient.virtualMachines.beginCreateOrUpdateAndWait(
      AZURE_RG,
      vmName,
      {
        location: AZURE_REGION,
        hardwareProfile: {
          vmSize: 'Standard_B1s',
        },
        osProfile: {
          computerName: vmName,
          adminUsername: 'sergey',
          linuxConfiguration: {
            disablePasswordAuthentication: true,
            ssh: {
              publicKeys: [
                {
                  path: `/home/sergey/.ssh/authorized_keys`,
                  keyData: sshPublicKey,
                },
              ],
            },
          },
        },
        storageProfile: {
          imageReference: {
            publisher: 'Canonical',
            offer: '0001-com-ubuntu-server-focal',
            sku: '20_04-lts',
            version: 'latest',
          },
          osDisk: {
            name: `${vmName}-osdisk`,
            caching: 'ReadWrite',
            createOption: 'FromImage',
            managedDisk: {
              storageAccountType: 'Standard_LRS',
            },
          },
        },
        networkProfile: {
          networkInterfaces: [
            {
              id: nicId,
              primary: true,
            },
          ],
        },
      },
    );

    return vm;
  }


  async deleteVm(vmName: string) {
    const result = await this.computeClient.virtualMachines.beginDeleteAndWait(
      AZURE_RG,
      vmName,
    );
  
    return { message: `VM "${vmName}" deleted successfully.`, result };
  }
  
}
