import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { VmModule } from './vm/vm.module';
import { DbController } from './db/db.controller';
import { DbModule } from './db/db.module';

@Module({
  imports: [VmModule, DbModule],
  controllers: [AppController, DbController],
  providers: [AppService],
})
export class AppModule {}
