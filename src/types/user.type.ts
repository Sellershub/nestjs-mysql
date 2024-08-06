import { UserEntity } from '../modules/user/entities/user.entity';

export type UserType = Omit<UserEntity, 'hashPassword'>;
