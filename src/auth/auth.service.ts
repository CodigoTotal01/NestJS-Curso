import { BadRequestException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import * as bcrypt from 'bcrypt'; //! una forma ligera de una ffroma de adapter

import { User } from './entities/user.entity';
import { CreateUserDto, LoginUserDto } from './dto';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './interfaces/jwt-payload.interfaces';


@Injectable()
export class AuthService {

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService // proporcionado por el jwt module - ya ta configurado
  ) {
  }

  async create(createAuthDto: CreateUserDto) {
    const {password, ...userDate} = createAuthDto;


    try {
      const user = this.userRepository.create({
        ...userDate,
        password: await bcrypt.hash(password, 10),
      });
      await this.userRepository.save(user);
      delete user.password;
      return {
        ...user,
        token: this.getJwtToken({email: user.email}),
      };
    } catch (error) {
      this.handleError(error);
    }
  }

//! Never, indica que el metodo nunca va a retornar un valor
  private handleError(error: any): never {
    if(error.code === '23505') {
      throw new BadRequestException(error.detail);
    }

    console.log(error);
    throw new InternalServerErrorException('Internal server error');
  }

  async login(loginUserDto: LoginUserDto) {
    const { password, email } = loginUserDto;
    const user: User = await this.userRepository.findOne({
      where: {email},
      select: {
        email: true,
        password: true
      },
    });

    if(!user){
      throw new UnauthorizedException('Invalid credentials');
    }
    if(bcrypt.compare(password, user.password)){
      throw new UnauthorizedException('Invalid credentials');
    }

    return {
      ...user,
      token: this.getJwtToken({email: user.email}),
    };
    
  }

  private getJwtToken(payload: JwtPayload) {
    const token = this.jwtService.sign(payload);
    return token;
  }
}
