import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SignUpDto } from './dto/signup.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { User } from './schemas/user.schema';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<User>,
  ) {}
  async siginUp(signUpDto: SignUpDto): Promise<User> {
    const { name, email, password } = signUpDto;

    const user = await this.userModel.create({
      name,
      email,
      password,
    });
    return user;
  }

  findAll() {
    return `This action returns all auth`;
  }

  findOne(id: number) {
    return `This action returns a #${id} auth`;
  }

  update(id: number, updateAuthDto: UpdateAuthDto) {
    return `This action updates a #${id} auth`;
  }

  remove(id: number) {
    return `This action removes a #${id} auth`;
  }
}
