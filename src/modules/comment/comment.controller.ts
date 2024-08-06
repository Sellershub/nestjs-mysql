import {
  Controller,
  Post,
  Get,
  Body,
  UseGuards,
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';

import { CommentService } from './comment.service';
import { AuthGuard } from '../auth/guards/auth.guard';
import { CreateCommentDto } from './dto/create-comment.dto';
import { User } from '../../common/decorators/user.decorator';
import { multerConfig } from '../../config/multer.config';

@Controller('comments')
export class CommentController {
  constructor(private commentsService: CommentService) {}

  @Post()
  @UseGuards(AuthGuard)
  @UseInterceptors(FilesInterceptor('photos', 5, multerConfig))
  async createComment(
    @User('user_id') userId: number,
    @Body() createCommentDto: CreateCommentDto,
    @UploadedFiles() photos: Express.Multer.File[],
  ) {
    return this.commentsService.createComment(userId, createCommentDto, photos);
  }

  @Get('user')
  @UseGuards(AuthGuard)
  async getUserComments(@User('user_id') userId: number) {
    return this.commentsService.getUserComments(userId);
  }

  @Get('user/replies')
  @UseGuards(AuthGuard)
  async getUserReplies(@User('user_id') userId: number) {
    return this.commentsService.getUserReplies(userId);
  }
}
