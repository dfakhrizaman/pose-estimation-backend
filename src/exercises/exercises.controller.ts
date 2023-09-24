import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { GetUserId } from 'src/auth/decorators/get-user-id.decorator';
import { CreateExerciseDto } from './dto/create-exercise.dto';
import { ExercisesService } from './exercises.service';

@UseGuards(AuthGuard)
@Controller('exercises')
export class ExercisesController {
  constructor(private readonly exerciseService: ExercisesService) {}

  @Post('/submit')
  createExercise(
    @GetUserId() userId: string,
    @Body() payload: CreateExerciseDto,
  ) {
    return this.exerciseService.createExercise(payload, userId);
  }

  @Get()
  getAll() {
    return this.exerciseService.getExercises();
  }

  @Get('/:exerciseId')
  getDetail(@Param('exerciseId') exerciseId: string) {
    return this.exerciseService.getExerciseDetailByExerciseId(exerciseId);
  }

  @Get('/user/:userId')
  getDetailByUserId(@Param('userId') userId: string) {
    return this.exerciseService.getExerciseDetailByUserId(userId);
  }
}
