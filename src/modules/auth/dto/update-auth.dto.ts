import { PartialType } from '@nestjs/mapped-types';
import { SignUpDto } from './signup.dto';

export class UpdateAuthDto extends PartialType(SignUpDto) {}
