import { Body, Controller, Post, Get } from '@nestjs/common';
import { VmService } from './vm.service';

@Controller('api/azure/vm')
export class VmController {
  constructor(private readonly vmService: VmService) {}

  @Post('create')
async createVm(@Body() body: { vmName: string; sshKey: string }) {
  const vmName = body.vmName;
  const publicIpName = `${vmName}-ip`;
  const nicName = `${vmName}-nic`;

  const publicIpId = await this.vmService.createPublicIp(publicIpName);
  const nicId = await this.vmService.createNic(nicName, publicIpId);
  const vm = await this.vmService.createVm(vmName, nicId, body.sshKey);

  return vm;
}

  @Post('terminate')
async terminateVm(@Body() body: { vmName: string }) {
  return this.vmService.deleteVm(body.vmName);
}

}
