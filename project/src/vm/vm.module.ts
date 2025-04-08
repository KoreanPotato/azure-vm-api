import { Module } from '@nestjs/common';
import { VmController } from './vm.controller';
import { AzureModule } from '../azure/azure.module'; 
import { DbModule } from 'src/db/db.module';
import { VmService } from './vm.service';
import { VmEntity } from './vm.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VmDbService } from 'src/db/db.service';



@Module({
  imports: [
    TypeOrmModule.forFeature([VmEntity]), 
    AzureModule,
    DbModule
  ],
  controllers: [VmController],
  providers: [
    VmService,
    VmDbService
  ]
})
export class VmModule {}
