import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { RoleEnum } from './generics/roleEnum';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity) private userRepo: Repository<UserEntity>,
    private jwtService: JwtService,
  ) {}

  async signUp(credentials) {
    //const { email, username } = credentials;
    const newUser = this.userRepo.create({
      email: credentials.email,
      username: credentials.username,
      salt: await bcrypt.genSalt(),
      role: RoleEnum.ROLE_USER,
    });
    newUser.password = await bcrypt.hash(credentials.password, newUser.salt);
    try {
      const result = await this.userRepo.save(newUser);
      return result;
    } catch (e) {
      throw new ConflictException('Username OR email existing');
    }
  }

  async signIn(credentials) {
    const { login, pwd } = credentials; // le login peut etre soit un username soit un email, nous on le sait pas !

    const qb = await this.userRepo.createQueryBuilder('user');

    const u = await qb
      .select('user')
      .where('user.username = :identifiant or user.email = :identifiant')
      .setParameters({ identifiant: login })
      .getOne();

    console.log(u);

    if (!u) throw new NotFoundException('Username OR email not existing');
    else {
      const comparaison = await bcrypt.compare(pwd, u.password);
      if (comparaison) {
        const token = this.jwtService.sign({
          identifiant: login,
          role: u.role,
        });
        return {
          identifiant: login,
          role: u.role,
          access_token: token,
        };
      } else throw new NotFoundException('Wrong Password');
    }
  }
}
