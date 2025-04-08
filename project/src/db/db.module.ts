import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VmEntity } from '../vm/vm.entity';
import * as dotenv from 'dotenv';
import { VmDbService } from './db.service'
import { DbController } from './db.controller';

dotenv.config();

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'db', 
      port: 5432,
      username: 'myuser',
      password: 'mypassword',
      database: 'mydb',
      entities: [__dirname + '/../**/*.entity.{js,ts}'],
      synchronize: true,
      retryAttempts: 10, 
      retryDelay: 3000,  
    }),
    TypeOrmModule.forFeature([VmEntity])
  ],
  providers: [VmDbService],
  exports: [VmDbService],
  controllers: [DbController]
})


export class DbModule {}
