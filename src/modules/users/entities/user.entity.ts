import { compare, hash } from "bcryptjs";
import { Exclude } from 'class-transformer';
import { BeforeInsert, Column, Entity } from 'typeorm';
import { BaseEntity } from './base.entity';

export enum Role {
  systemAdmin = "sytemAdmin",
  schoolAdmin = "schoolAdmin",
  user = "user"

}

@Entity('users')
export class User extends BaseEntity {

  @Column()
  name: string;

  @Column({ unique: true, nullable: true })
  phoneNumber: string;

  @Column({ unique: true })
  email: string;

  @Column({ default: false })
  isVerified: boolean;

  @Column({ nullable: true })
  verifiedAt: Date;

  @Column({ enum: Role, default: Role.user })
  role: Role;

  @Exclude()
  @Column({ nullable: true })
  emailVerifyCode: string | null;

  @Exclude()
  @Column()
  password: string;

  @BeforeInsert()
  async hashPassword() {
    this.password = await hash(this.password, 10);
  }

  async validatePassword(password: string): Promise<boolean> {
    return await compare(password, this.password);
  }

}
