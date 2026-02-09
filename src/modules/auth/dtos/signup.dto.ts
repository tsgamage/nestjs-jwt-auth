import { IsNotEmpty, IsString } from 'class-validator';
import { AuthDto } from './auth.dto.js';

export class SignUpDto extends AuthDto {
  @IsNotEmpty()
  @IsString()
  name!: string;
}
