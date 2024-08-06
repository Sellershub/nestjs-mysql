import { Body, Controller, Post, UsePipes } from '@nestjs/common';

import { AuthService } from './auth.service';
import { LoginDto, RegisterDto } from './dto';
import { BackendValidationPipe } from '../../common/pipes/backendValidation.pipe';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @UsePipes(new BackendValidationPipe())
  async login(@Body('user') loginDto: LoginDto) {
    const user = await this.authService.login(loginDto);
    return this.authService.generateUserResponse(user);
  }

  @Post('register')
  @UsePipes(new BackendValidationPipe())
  async register(@Body('user') registerDto: RegisterDto) {
    return await this.authService.register(registerDto);
  }
}
