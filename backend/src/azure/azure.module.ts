import { Module } from '@nestjs/common';
import { AzureAuthService } from './azure-auth.service';

@Module({
  providers: [AzureAuthService],
  exports: [AzureAuthService], 
})
export class AzureModule {}
