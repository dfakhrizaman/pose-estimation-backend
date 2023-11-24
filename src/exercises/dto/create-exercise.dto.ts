import {
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';
import { ExerciseType } from '../enum/exercise.enum';

export class CreateExerciseDto {
  @IsString()
  @IsEnum(ExerciseType)
  readonly type: string;

  @IsNumber()
  readonly duration: number;

  @IsNumber()
  @Min(0)
  @Max(10)
  readonly score: number;

  @IsNumber()
  @IsOptional()
  @Min(0)
  readonly accuracy: number;
}
