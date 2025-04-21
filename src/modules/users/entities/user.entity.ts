import { Exclude } from 'class-transformer';
import { Column, Entity } from 'typeorm';
import { BaseEntity } from './base.entity';

@Entity('users')
export class User extends BaseEntity {
  @Column({ unique: true })
  email: string;

  @Column({ default: false })
  isVerified: boolean;

  @Exclude()
  @Column({ nullable: true })
  emailVerifyCode: string | null;

  @Exclude()
  @Column()
  password: string;
}
