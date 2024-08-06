import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { CommentEntity } from '../../comment/entities/comment.entity';

@Entity('photos')
export class PhotoEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  url: string;

  @ManyToOne(() => CommentEntity, (comment) => comment.photos)
  comment: CommentEntity;

  @CreateDateColumn()
  createdAt: Date;
}
