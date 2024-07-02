import { Body, Controller, Post } from '@nestjs/common';
import { UserService } from './services/user.service';
import { LoginDto } from './dto/user.dto';

@Controller('/auth')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async create(@Body() user: LoginDto) {
    return this.userService.create(user);
  }
}
