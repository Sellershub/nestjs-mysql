import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';

import { CommentEntity } from './entities/comment.entity';
import { PhotoEntity } from '../photo/entities/photo.entity';
import { UserEntity } from '../user/entities/user.entity';
import { CreateCommentDto } from './dto/create-comment.dto';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(CommentEntity)
    private commentRepository: Repository<CommentEntity>,
    @InjectRepository(PhotoEntity)
    private photoRepository: Repository<PhotoEntity>,
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}

  async createComment(
    userId: number,
    createCommentDto: CreateCommentDto,
    photos: Express.Multer.File[],
  ) {
    const user = await this.userRepository.findOne({
      where: { user_id: userId },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    let parent = null;
    if (createCommentDto.parentId) {
      parent = await this.commentRepository.findOne({
        where: { id: createCommentDto.parentId },
      });
      if (!parent) {
        throw new NotFoundException('Parent comment not found');
      }
      if (parent.parent) {
        throw new Error('Cannot nest comments more than one level deep');
      }
    }

    const comment = this.commentRepository.create({
      content: createCommentDto.content,
      user,
      parent,
    });

    await this.commentRepository.save(comment);

    if (photos && photos.length > 0) {
      const photoEntities = photos.map((photo) =>
        this.photoRepository.create({ url: photo.path, comment }),
      );
      await this.photoRepository.save(photoEntities);
      comment.photos = photoEntities;
    }

    return comment;
  }

  async getUserComments(userId: number): Promise<CommentEntity[]> {
    return this.commentRepository.find({
      where: { user: { user_id: userId } },
      relations: ['replies', 'photos'],
    });
  }

  async getUserReplies(userId: number): Promise<CommentEntity[]> {
    return this.commentRepository.find({
      where: {
        user: { user_id: userId },
        parent: { user: { user_id: Not(userId) } },
      },
      relations: ['parent', 'photos'],
    });
  }
}
