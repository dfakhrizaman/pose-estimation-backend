import { Body, Controller, Get, Patch, Post, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { GetUserId } from 'src/auth/decorators/get-user-id.decorator';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(AuthGuard)
  @Get()
  getAll() {
    return {
      users: this.usersService.getUsers(),
    };
  }

  @Get('/leaderboard')
  getLeaderboard() {
    return this.usersService.getUsersLeaderboard();
  }

  @Get('/latest-exercise')
  getUsersByLatestExercise() {
    return this.usersService.getUsersByLatestExercise();
  }

  @UseGuards(AuthGuard)
  @Get('/profile')
  getUserDetail(@GetUserId() userId: string) {
    return this.usersService.getOne(userId);
  }

  @UseGuards(AuthGuard)
  @Patch('/update-profile')
  updateProfile(@GetUserId() userId: string, @Body() payload: UpdateUserDto) {
    return this.usersService.updateProfile(userId, payload);
  }

  @Post('/register')
  createUser(@Body() userData: CreateUserDto) {
    return this.usersService.createUser(userData);
  }
}
