import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  BeforeInsert,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { hash } from 'bcrypt';

import { CommentEntity } from '../../comment/entities/comment.entity';

@Entity({ name: 'users' })
export class UserEntity {
  @PrimaryGeneratedColumn()
  user_id: number;

  @Column()
  user_email: string;

  @Column({ select: false })
  user_password: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => CommentEntity, (comment) => comment.user)
  comments: CommentEntity[];

  @BeforeInsert()
  async hashPassword(): Promise<void> {
    this.user_password = await hash(this.user_password, 10);
  }
}
