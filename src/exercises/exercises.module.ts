import { Module } from '@nestjs/common';
import { DbModule } from 'src/db/db.module';
import { ExercisesController } from './exercises.controller';
import { ExercisesService } from './exercises.service';

@Module({
  controllers: [ExercisesController],
  providers: [ExercisesService],
  imports: [DbModule],
})
export class ExercisesModule {}
