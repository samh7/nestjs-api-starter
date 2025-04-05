import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto, LoginDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Not, Repository, IsNull } from 'typeorm';
import { compare, hash } from 'bcryptjs';
import { plainToClass, plainToInstance } from 'class-transformer';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async validateUser(createAuthDto: LoginDto) {
    const loginUser = await this.login(createAuthDto);

    return loginUser;
  }

  async create(createUserDto: CreateUserDto) {
    try {
      const hashedPassword = await hash(createUserDto.password, 10);

      const newUser: CreateUserDto = {
        ...createUserDto,
        password: hashedPassword,
      };

      const savedUser = plainToClass(
        User,
        await this.userRepository.save(newUser),
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

    return plainToClass(User, canUserLogIn);
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

      return plainToClass(
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

      return plainToClass(User, await this.userRepository.save(updatedUser));
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
