import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiTags } from '@nestjs/swagger';
import { CreateUserDto, LoginUserDto } from './dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}


  @Post('register')
  create(@Body() createAuthDto: CreateUserDto)  {
    return this.authService.create(createAuthDto);
  }


  @Post('login')
  loginUser (@Body() loginUserDto: LoginUserDto)  {
    return this.authService.login(loginUserDto);
  }

}
