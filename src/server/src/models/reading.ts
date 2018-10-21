import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Sensor } from './sensor';

@Entity({
  name: 'readings',
})
export class Reading extends BaseEntity {
  @PrimaryGeneratedColumn({
    name: 'reading_id',
  })
  public id!: number;

  @Column('float', {
    name: 'reading_value',
  })
  public value!: number;

  @Column('datetime', {
    name: 'reading_taken_at',
  })
  public takenAt!: Date;

  @ManyToOne(_ => Sensor, sensor => sensor.readings)
  @JoinColumn({
    name: 'reading_sen_id',
  })
  public sensor!: Sensor;
}
