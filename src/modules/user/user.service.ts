import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';

import { UserEntity } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async findById(user_id: number) {
    return await this.userRepository.findOne({ where: { user_id } });
  }
}
