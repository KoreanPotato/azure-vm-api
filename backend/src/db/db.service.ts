import { Injectable } from '@nestjs/common';
import { InjectRepository, } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { VmEntity } from 'src/vm/vm.entity';

@Injectable()
export class VmDbService {
  constructor(
    @InjectRepository(VmEntity)
    private readonly vmRepo: Repository<VmEntity>,
  ) {}

  async saveVm(vmId: string, vmName: string) {
    

    const existing = await this.vmRepo.findOne({ where: { vmId } });
    if (existing) {
      console.log(`⚠️ VM с vmId ${vmId} уже есть в базе. Пропускаем сохранение.`);}


    const newVm = this.vmRepo.create({ vmId, vmName });
    return await this.vmRepo.save(newVm); 
  }

  async deleteVmById(vmId: string) {
    const deletedVm = await this.vmRepo.delete({vmId})
    return deletedVm
  }

  async getAllVms() {
    const allVms = await this.vmRepo.find()
    return allVms
  }

  async findByName(vmName: string) {
    return this.vmRepo.findOneBy({ vmName });
  }

  async onModuleInit() {
    console.log('VmDbService инициализирован. Проверяем подключение к БД...');
    const count = await this.vmRepo.count();
    console.log(`В таблице VM уже есть ${count} записей`);
  }
}