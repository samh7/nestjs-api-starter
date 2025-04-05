import { JwtAuthGuard } from './guards/jwt.guards';
import { LocalGuard } from './guards/local.guard';
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Res,
  Req,
  NotFoundException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto, LoginDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import environment from 'src/common/environment';
import { User } from './entities/user.entity';
@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  @Post('signup')
  async create(@Body() createUserDto: CreateUserDto) {
    const createdUser = await this.usersService.create(createUserDto);
    return createdUser;
  }

  @Post('login')
  @UseGuards(LocalGuard)
  login(@Res({ passthrough: true }) res: any, @Req() req: Request) {
    const user = req.user as User;

    if (!user) {
      throw new NotFoundException('User Not Found');
    }

    const payload = {
      email: user.email,
      createdAt: user.createdAt,
      deletedAt: user.deletedAt,
      id: user.id,
      updatedAt: user.updatedAt,
    };

    const token = this.jwtService.sign(payload);

    res.cookie('Authentication', token, {
      httpOnly: true,
      secure: environment.NODE_ENV === 'production',
      sameSite: 'Strict',
      maxAge: 3600000,
    });

    return user;
  }

  @UseGuards(JwtAuthGuard)
  @Get('status')
  status(@Req() req: Request) {
    return req.user;
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':email')
  findOne(@Param('email') email: string) {
    return this.usersService.findOne(email);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':email')
  update(@Param('email') email: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(email, updateUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':email')
  remove(@Param('email') email: string) {
    return this.usersService.remove(email);
  }
}
