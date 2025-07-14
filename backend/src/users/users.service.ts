import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schema/user.schema';
import { Model } from 'mongoose';

@Injectable()
export class UsersService {
  constructor(@InjectModel('users') private userModel: Model<User>) {}
  async create({ name, lastname, password, email }: CreateUserDto) {
    const existUser = await this.userModel.findOne({ email });
    if (existUser) {
      throw new BadRequestException('Email alredy in use');
    }

    const newUser = await this.userModel.create({
      name,
      lastname,
      password,
      email,
    });

    return { success: 'ok', data: newUser };
  }

  findAll() {
    return this.userModel.find();
  }
  async findOne(id: string): Promise<User | null> {
    return this.userModel.findById(id).exec();
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
