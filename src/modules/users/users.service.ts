import { EnvSchema } from "#/common/env.schema";
import {
  HttpException,
  HttpStatus,
  Injectable
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToInstance } from 'class-transformer';
import { Repository } from 'typeorm';
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

    const entityLikeUser = this.userRepository.create(createUserDto);

    const savedUser = await this.userRepository.save(entityLikeUser);

    // const context
    //   : ConfirmEmailType
    //   = {
    //   name: savedUser.email,
    //   verificationLink: `${this.configService.get("VERIFY_EMAIL_URL")}/${savedUser.emailVerifyCode}`,
    //   appName: this.configService.get("APP_NAME"),
    //   year: new Date(),
    // };

    // this.emailService.sendEmail(
    //   savedUser.email,
    //   'Please confirm your email',
    //   'confirm-email',
    //   context
    // );

    return plainToInstance(
      User,
      savedUser
    );

  }

  async login(loginDto: LoginDto) {
    const canUserLogIn = await this.userRepository.findOne({
      where: { email: loginDto.email },
    });

    const compareHashes = await canUserLogIn.validatePassword(
      loginDto.password
    );


    if (!compareHashes)
      throw new HttpException(
        'User Not Authneticated',
        HttpStatus.UNAUTHORIZED,
      );

    return plainToInstance(User, canUserLogIn);
  }

  async findAll() {
    return plainToInstance(User, await this.userRepository.find());
  }

  async findOne(id: string) {
    return plainToInstance(
      User,
      await this.userRepository.findOne({ where: { id } }),
    );
  }

  async update(id: string, updateUserDto: UpdateUserDto) {

    const user = await this.findOne(id);

    const updatedUser = Object.assign(user, updateUserDto);

    return plainToInstance(User, await this.userRepository.save(updatedUser));

  }

  async remove(username: string) {
    const user = await this.findOne(username);

    await this.userRepository.remove(user);
  }
}
