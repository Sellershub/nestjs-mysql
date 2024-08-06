import { IsEmail, IsString } from 'class-validator';

export class LoginDto {
  @IsEmail()
  user_email: string;

  @IsString()
  user_password: string;
}
