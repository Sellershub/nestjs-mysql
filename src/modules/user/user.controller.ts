import { Controller, Get, UseGuards } from '@nestjs/common';

import { UserService } from './user.service';
import { AuthGuard } from '../auth/guards/auth.guard';
import { User } from '../../common/decorators/user.decorator';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @UseGuards(AuthGuard)
  async getCurrentUser(@User('user_id') userId: number) {
    return this.userService.findById(userId);
  }
}
