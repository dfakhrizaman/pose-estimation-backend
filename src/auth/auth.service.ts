import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { comparePassword } from 'src/utils/bcyrpt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async login(username: string, pass: string): Promise<any> {
    const user = await this.usersService.getOneByUsername(username);

    if (!user) {
      throw new NotFoundException();
    }

    const matchedPassword = comparePassword(pass, user.password);

    if (!matchedPassword) {
      throw new HttpException(
        'Incorrect password or username.',
        HttpStatus.UNAUTHORIZED,
      );
    }

    const jwtPayload = {
      user: user.username,
      sub: user.id,
    };

    return {
      access_token: await this.jwtService.signAsync(jwtPayload),
      user_info: {
        id: user.id,
        username: user.username,
        age: user.age || null,
        height: user.height || null,
        weight: user.weight || null,
        sex: user.sex || null,
      },
    };
  }
}
