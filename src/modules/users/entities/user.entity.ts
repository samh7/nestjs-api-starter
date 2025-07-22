import { generateEmailVerificationCode } from "#/common/utils";
import { compare, hash } from "bcryptjs";
import { Exclude } from 'class-transformer';
import { BeforeInsert, BeforeUpdate, Column, Entity } from 'typeorm';
import { BaseEntity } from '../../../common/base.entity';


@Entity('users')
export class User extends BaseEntity {

  @Column()
  adminName: string;

  @Column()
  maxStorage: string;

  @Column({ default: false })
  active: boolean;

  @Column()
  billingStartDate: Date;

  @Column()
  billingEndDate: Date;

  @Column()
  billingAmount: number;

  @Column()
  motto: string;

  @Column()
  address: string;

  @Column({ unique: true })
  phoneNumber: string;

  @Column({ unique: true })
  email: string;

  @Column({ default: false })
  isVerified: boolean;

  @Column({ nullable: true })
  verifiedAt?: Date | null;

  @Column({ nullable: true })
  lastPasswordReset: Date;


  @Column({ nullable: true })
  lastEmailSent: Date;

  @Exclude()
  @Column({ nullable: true, unique: true })
  passwordResetToken?: string | null;

  @Exclude()
  @Column({ nullable: true, unique: true })
  passwordResetTokenGenerateAt?: Date | null;


  @Exclude()
  @Column({ nullable: true })
  emailVerifyCode?: string | null;

  @Exclude()
  @Column()
  password: string;

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword() {
    this.password = await hash(this.password, 10);
  }

  @BeforeInsert()
  @BeforeUpdate()
  trimStrings() {
    for (const key in this) {
      if (typeof this[key] === 'string') {
        (this as any)[key] = (this[key] as string).trim();
      }
    }
  }

  async validatePassword(password: string): Promise<boolean> {
    return await compare(password, this.password);
  }

  @BeforeInsert()
  async setEmailVerifyCode() {
    this.emailVerifyCode = generateEmailVerificationCode(32);
  }

  @BeforeUpdate()
  checkPasswordResetTokenUpdate() {
    if (this.passwordResetTokenGenerateAt !== null) {
      this.lastPasswordReset = new Date();
    }
  }

}
