import { Exclude } from 'class-transformer';
import { EmploymentType, Gender } from '#/common/enums/user.enum';
import { BaseEntity } from './base.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

@Entity('users')
export class User extends BaseEntity {
  @Column({ unique: true })
  email: string;

  @Column()
  @Exclude()
  password: string;
}
