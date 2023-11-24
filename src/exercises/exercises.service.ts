import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PG_CONNECTION } from 'src/constants';
import { CreateExerciseDto } from './dto/create-exercise.dto';

@Injectable()
export class ExercisesService {
  constructor(@Inject(PG_CONNECTION) private conn: any) {}

  async createExercise(payload: CreateExerciseDto, userId: string) {
    console.log(payload);

    try {
      await this.conn.query(
        `INSERT INTO public."exercise" ("type", duration, score, user_id, accuracy, username)
            VALUES('${payload.type}', ${payload.duration}, ${payload.score}, ${payload.accuracy}, '${userId}', 
            (SELECT username FROM public."user" WHERE id = '${userId}'));`,
      );

      return {
        message: `Successfully submitted ${payload.type} exercise.`,
        data: payload,
      };
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }

  async getExercises() {
    try {
      const result = await this.conn.query(
        'SELECT id, "type", duration, score, completed_at, user_id, username FROM public."exercise" ORDER BY completed_at DESC',
      );
      return {
        data: result.rows,
      };
    } catch (error) {
      throw new NotFoundException();
    }
  }

  async getExerciseDetailByUserId(userId: string) {
    try {
      const result = await this.conn.query(
        `
          SELECT id, "type", duration, score, completed_at, user_id
          FROM public."exercise" 
          WHERE user_id='${userId}'
        `,
      );

      return {
        data: result.rows,
      };
    } catch (error) {
      throw new NotFoundException();
    }
  }

  async getExerciseDetailByExerciseId(exerciseId: string) {
    try {
      const result = await this.conn.query(
        `
          SELECT id, "type", duration, score, completed_at, user_id
          FROM public."exercise" 
          WHERE id='${exerciseId}'
        `,
      );

      return {
        data: result.rows[0],
      };
    } catch (error) {
      throw new NotFoundException();
    }
  }
}
