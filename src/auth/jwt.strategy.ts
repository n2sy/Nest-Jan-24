import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(UserEntity) private userRepo: Repository<UserEntity>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'supersecretcode',
    });
  }

  async validate(payload: any) {
    console.log(payload);
    const qb = await this.userRepo.createQueryBuilder('user');

    const u = await qb
      .select('user')
      .where('user.username = :identifiant or user.email = :identifiant')
      .setParameters({ identifiant: payload.identifiant })
      .getOne();
    console.log(u);

    if (u) {
      delete u.password;
      delete u.salt;
      return u;
    } else throw new UnauthorizedException();
  }
}
