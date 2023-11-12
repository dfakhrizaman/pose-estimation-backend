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

  async getUsersLeaderboard() {
    try {
      const result = await this.conn.query(`
      SELECT
        public."user".id AS user_id,
        public."user".username,
        COUNT(public."exercise".id) AS exercise_count
      FROM
        public."user"
      LEFT JOIN
        public."exercise" ON public."user".id = public."exercise".user_id
      WHERE
        public."exercise".completed_at >= CURRENT_DATE - INTERVAL '7 days' OR public."exercise".completed_at IS NULL
      GROUP BY
        public."user".id, public."user".username
      ORDER BY
        exercise_count DESC;
      `);

      return {
        data: result.rows,
      };
    } catch (error) {
      throw new NotFoundException();
    }
  }

  async getUsersByLatestExercise() {
    try {
      const result = await this.conn.query(`
      SELECT
        public."user".id AS user_id,
        public."user".username AS user_username,
        public."exercise".id AS exercise_id,
        public."exercise"."type" AS exercise_type,
        public."exercise".duration AS exercise_duration,
        public."exercise".score AS exercise_score,
        public."exercise".completed_at AS latest_completed_at
      FROM
        public."user"
      LEFT JOIN
        public."exercise" ON public."user".id = public."exercise".user_id
      WHERE
        public."exercise".completed_at = (
          SELECT MAX(completed_at)
          FROM public."exercise"
          WHERE user_id = public."user".id
        )
      ORDER BY
        latest_completed_at DESC;
      `);

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
