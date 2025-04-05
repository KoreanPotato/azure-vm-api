import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { VmModule } from './vm/vm.module';

@Module({
  imports: [VmModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
