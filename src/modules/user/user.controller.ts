import { Body, Controller, Get, Post, Req } from '@nestjs/common';
import { UserService } from './services/user.service';
import { LoginDto } from './dto/user.dto';

@Controller('/auth')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async create(@Body() user: LoginDto) {
    return this.userService.create(user);
  }

  @Get()
  async getUserByToken(@Req() request: Request) {
    const token = request.headers['authorization'] as string;
    return this.userService.getUserByToken(token);
  }

  @Get('/refresh-token')
  async refreshToken(@Req() request: Request) {
    const token = request.headers['refreshToken'] as string;
    return this.userService.refreshTokenLdap(token);
  }
}
