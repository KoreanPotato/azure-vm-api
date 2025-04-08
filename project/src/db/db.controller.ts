import { Controller } from '@nestjs/common';
import { Get } from '@nestjs/common';
import { VmDbService } from './db.service';


@Controller('api/db')
export class DbController {
  constructor(private readonly vmDbService: VmDbService) {}

  @Get('all')
  getAllVms() {
    return this.vmDbService.getAllVms();
  }
}

