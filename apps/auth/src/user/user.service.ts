import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '../schema/User.schema';
import { Model } from 'mongoose';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async getMyProfile(request: any) {
    const userData = await this.userModel.findById(request.user.id);
    return { data: userData };
  }

  async updateProfile(updateUserDto: UpdateUserDto, request: any) {
    const userFound = await this.userModel.findById(request.user.id);
    if (!userFound) {
      throw new BadRequestException('Invalid user');
    }

    // update user
    await this.userModel.findByIdAndUpdate(request.user.id, updateUserDto);
    return 'User updated successfully';
  }

  findAll() {
    return `This action returns all user`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
