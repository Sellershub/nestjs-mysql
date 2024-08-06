import { IsEmail, IsString, MinLength } from 'class-validator';

export class RegisterDto {
  @IsEmail()
  user_email: string;

  @IsString()
  @MinLength(6)
  user_password: string;
}
