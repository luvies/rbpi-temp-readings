import { BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Reading } from './reading';

@Entity({
  name: 'sensors',
})
export class Sensor extends BaseEntity {
  @PrimaryGeneratedColumn({
    name: 'sen_id',
  })
  public id!: number;

  @Column('varchar', {
    name: 'sen_serial_num',
    length: 20,
  })
  public serialNum!: string;

  @Column('text', {
    name: 'sen_desc',
  })
  public desc!: string;

  @OneToMany(_ => Reading, reading => reading.sensor)
  public readings!: Reading[];
}
