import {
  ConflictException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { compare } from 'bcrypt';

import { LoginDto, RegisterDto } from './dto';
import { Repository } from 'typeorm';
import { UserEntity } from '../user/entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { UserResponseInterface } from '../../types/userResponse.interface';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto) {
    const errorResponse = {
      errors: {
        'email or password': 'is invalid',
      },
    };

    const { user_email, user_password } = loginDto;
    const user = await this.userRepository.findOne({
      where: { user_email },
      select: ['user_id', 'user_email', 'user_password'],
    });

    if (!user) {
      throw new HttpException(errorResponse, HttpStatus.UNPROCESSABLE_ENTITY);
    }

    const isPasswordCorrect = await compare(user_password, user.user_password);
    if (!isPasswordCorrect) {
      throw new HttpException(errorResponse, HttpStatus.UNPROCESSABLE_ENTITY);
    }

    return user;
  }

  async register(registerDto: RegisterDto) {
    const { user_email } = registerDto;
    const errorResponse = {
      errors: {},
    };

    const userByEmail = await this.userRepository.findOne({
      where: { user_email },
    });

    if (userByEmail) {
      errorResponse.errors['email'] = 'has already been taken';
      throw new ConflictException('Email or username already exists');
    }

    if (Object.keys(errorResponse.errors).length) {
      throw new HttpException(errorResponse, HttpStatus.UNPROCESSABLE_ENTITY);
    }

    const newUser = new UserEntity();
    Object.assign(newUser, registerDto);
    return await this.userRepository.save(newUser);
  }

  generateUserResponse(user: UserEntity): UserResponseInterface {
    const token = this.generateJwt(user);
    delete user.user_password;
    return {
      user: {
        ...user,
        token,
      },
    };
  }

  private generateJwt(user: UserEntity): string {
    const payload = { id: user.user_id, email: user.user_email };
    return this.jwtService.sign(payload);
  }
}
