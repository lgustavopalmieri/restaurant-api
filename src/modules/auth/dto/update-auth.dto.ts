import { PartialType } from '@nestjs/mapped-types';
import { CreateAuthDto } from './signup.dto';

export class UpdateAuthDto extends PartialType(CreateAuthDto) {}
