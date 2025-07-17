import { tryExecuteAsync } from "#/common/utils";
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  UseGuards
} from '@nestjs/common';
import { JwtAuthGuard } from "../auth/guards/jwt.guards";
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';

@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
  ) { }


  @Get()
  findAll() {
    return tryExecuteAsync(this.usersService.findAll);
  }


  @Get(':id')
  findOne(@Param('id') id: string) {
    return tryExecuteAsync(this.usersService.findOne, id);

  }


  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return tryExecuteAsync(this.usersService.update, id, updateUserDto);
  }


  @Delete(':id')
  remove(@Param('id') id: string) {
    tryExecuteAsync(this.usersService.remove, id);
  }
}
