import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from "@nestjs/jwt";
import { InjectRepository } from "@nestjs/typeorm";
import { compare } from "bcryptjs";
import { Repository } from "typeorm";
import { CreateUserDto } from "../users/dto/create-user.dto";
import { User } from "../users/entities/user.entity";
import { UsersService } from "../users/users.service";
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
    // private readonly configService: ConfigService,
  ) { }
  status() {
    throw new Error("Method not implemented.");
  }
  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;
    const savedUser = await this.userRepository.findOneBy({ email });

    if (!savedUser) {
      throw new Error("User not found");
    }

    if (await compare(password, savedUser.password)) {
      throw new UnauthorizedException("Invalid password or Email");
    }


    const payload = { email: savedUser.email, id: savedUser.id };
    const token = this.jwtService.sign(payload, {});
  }
  register(createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);

  }
  create(LoginDto: LoginDto) {
    return 'This action adds a new auth';
  }

  findOne(id: number) {
    return `This action returns a #${id} auth`;
  }

}
