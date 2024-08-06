import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { PhotoEntity } from '../photo/entities/photo.entity';
import { CommentEntity } from './entities/comment.entity';
import { UserEntity } from '../user/entities/user.entity';
import { CommentService } from './comment.service';
import { CommentController } from './comment.controller';

@Module({
  imports: [TypeOrmModule.forFeature([CommentEntity, PhotoEntity, UserEntity])],
  controllers: [CommentController],
  providers: [CommentService],
})
export class CommentModule {}
