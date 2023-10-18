import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
// import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { PG_CONNECTION } from 'src/constants';
import { User } from './entities/user.entity';
import { UpdateUserDto } from './dto/update-user.dto';
import { encodePassword } from 'src/utils/bcyrpt';

@Injectable()
export class UsersService {
  constructor(@Inject(PG_CONNECTION) private conn: any) {}

  async getUsers() {
    try {
      const result = await this.conn.query(
        'SELECT id, username, password FROM public."user"',
      );
      return {
        data: result.rows,
      };
    } catch (error) {
      throw new NotFoundException();
    }
  }

  async getOne(id: string) {
    try {
      const result = await this.conn.query(
        `
          SELECT id, username, age, height, weight, sex 
          FROM public."user" 
          WHERE id='${id}'
        `,
      );

      return {
        data: result.rows[0],
      };
    } catch (error) {
      throw new NotFoundException();
    }
  }

  async getOneByUsername(username: string): Promise<User> {
    try {
      const result = await this.conn.query(
        `SELECT id, username, password, age, height, weight, sex FROM public."user" WHERE username='${username}'`,
      );
      return result.rows[0];
    } catch (error) {
      throw new NotFoundException();
    }
  }

  async createUser(userData: CreateUserDto) {
    const payload = {
      username: userData.username,
      password: encodePassword(userData.password),
    };

    try {
      await this.conn.query(
        `INSERT INTO public."user"
        (username, "password")
        VALUES('${payload.username}', '${payload.password}');`,
      );
      return {
        message: `Successfully registered ${payload.username}`,
      };
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }

  async updateProfile(id: string, payload: UpdateUserDto) {
    try {
      await this.conn.query(
        `UPDATE public."user"
          SET height = ${payload.height},
            weight = ${payload.weight},
            sex = '${payload.sex}',
            age = ${payload.age}
        WHERE id = '${id}';`,
      );

      return {
        message: 'Update profile successful.',
        data: payload,
      };
    } catch (error) {
      throw new NotFoundException();
    }
  }
}
