import { EnvSchema } from "#/common/env.schema";
import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { compare, hash } from 'bcryptjs';
import { plainToInstance } from 'class-transformer';
import { Repository } from 'typeorm';
import { ConfirmEmailType } from "../../common/types";
import { generateEmailVerificationCode } from "../../common/utils";
import { LoginDto } from "../auth/dto/login.dto";
import { EmailService } from "../email/email.service";
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly emailService: EmailService,
    private readonly configService: ConfigService<EnvSchema>

  ) { }

  async create(createUserDto: CreateUserDto) {

    const _existingUser = await this.userRepository.findOneBy({ email: createUserDto.email });

    if (_existingUser) {
      throw new HttpException('User with this email already exists', HttpStatus.BAD_REQUEST);
    }


    try {
      const hashedPassword = await hash(createUserDto.password, 10);

      const emailVerifyCode = generateEmailVerificationCode(17);
      const newUser: Partial<User> = {
        ...createUserDto,
        emailVerifyCode,
        password: hashedPassword,
      };

      const savedUser = plainToInstance(
        User,
        await this.userRepository.save(newUser),
      );

      const context
        : ConfirmEmailType
        = {
        name: savedUser.email,
        verificationLink: `${this.configService.get("VERIFY_EMAIL_URL")}/${emailVerifyCode}`,
        appName: this.configService.get("APP_NAME"),
        year: new Date(),
      };

      this.emailService.sendEmail(
        savedUser.email,
        'Please confirm your email',
        'confirm-email',
        context
      );
      if (!savedUser)
        throw new HttpException(
          'User creation failed',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );

      const { password, ...userWithoutPassword } = savedUser;

      return userWithoutPassword;
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY' || error.code === '23505') {
        throw new HttpException('Email already exists', HttpStatus.CONFLICT);
      }

      throw error;
    }
  }

  async login(loginDto: LoginDto) {
    const canUserLogIn = await this.userRepository.findOne({
      where: { email: loginDto.email },
    });

    const compareHashes = await compare(
      loginDto.password,
      canUserLogIn.password,
    );

    console.log(compareHashes, ' hashres');

    if (!compareHashes)
      throw new HttpException(
        'User Not Authneticated',
        HttpStatus.UNAUTHORIZED,
      );

    return plainToInstance(User, canUserLogIn);
  }

  async findAll() {
    try {
      return plainToInstance(User, await this.userRepository.find());
    } catch (error) {
      throw new HttpException(
        'Failed to retrieve users',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findOne(email: string) {
    try {
      if (!email) throw new NotFoundException();

      return plainToInstance(
        User,
        await this.userRepository.findOne({ where: { email } }),
      );
    } catch (error) {
      throw new HttpException(
        'User not found',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async update(username: string, updateUserDto: UpdateUserDto) {
    try {
      const user = await this.findOne(username);

      const updatedUser = Object.assign(user, updateUserDto);

      return plainToInstance(User, await this.userRepository.save(updatedUser));
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY' || error.code === '23505') {
        throw new HttpException('Duplicate entry', HttpStatus.CONFLICT);
      }

      throw error;
    }
  }

  async remove(username: string) {
    try {
      const user = await this.findOne(username);

      await this.userRepository.remove(user);
    } catch (error) {
      if (error.code === 'ER_ROW_IS_REFERENCED' || error.code === '23503') {
        throw new HttpException(
          'User cannot be deleted due to existing references',
          HttpStatus.BAD_REQUEST,
        );
      }

      throw error;
    }
  }
}
