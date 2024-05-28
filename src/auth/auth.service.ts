import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import * as bcrypt from 'bcrypt'; //! una forma ligera de una ffroma de adapter

import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';


@Injectable()
export class AuthService {

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
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
      return user;
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
}
