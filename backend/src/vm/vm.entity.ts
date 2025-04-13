import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('virtual_machines')
export class VmEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  vmName: string;

  @Column({ unique: true })
  vmId: string;
}
