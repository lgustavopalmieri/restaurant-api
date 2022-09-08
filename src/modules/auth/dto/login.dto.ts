import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @IsNotEmpty()
  @IsEmail({}, { message: 'Password or email incorrect.' })
  readonly email: string;

  @IsNotEmpty()
  @IsString()
  readonly password: string;
}
