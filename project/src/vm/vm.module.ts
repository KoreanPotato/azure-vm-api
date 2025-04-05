import { Module } from '@nestjs/common';
import { VmController } from './vm.controller';
import { AzureModule } from '../azure/azure.module'; 

import { VmService } from './vm.service';

@Module({
  imports: [AzureModule],
  controllers: [VmController],
  providers: [VmService]
})
export class VmModule {}
