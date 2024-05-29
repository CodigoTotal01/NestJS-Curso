import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtPayload } from '../interfaces/jwt-payload.interfaces';
import { User } from '../entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import * as path from 'node:path';
import { Injectable, UnauthorizedException } from '@nestjs/common';

@Injectable() //-> Debe enlazarse a alagun modulo 
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(@InjectRepository(User) private readonly userRepository: Repository<User>, configService: ConfigService) {
    super({
      secretOrKey: configService.get('JWT_SECRET'),
      //En que posicion queremos que se envie el tocken
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    });
  }

  async validate(payload: JwtPayload): Promise<User> {

    const { email } = payload;
    const user = await this.userRepository.findOneBy({ email })
    if (!user) throw new UnauthorizedException("Token is not valid");

    if (!user.isActive) throw new UnauthorizedException("User is not active, talk with the admin");
    return user;

  }
}