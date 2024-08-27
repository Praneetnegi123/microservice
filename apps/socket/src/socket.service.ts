import { Injectable } from '@nestjs/common';
import { Messages } from './schema/Message.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateMessageDto } from './dto/Create-message.dto';
import { User } from 'apps/auth/src/schema/User.schema';

@Injectable()
export class SocketService {
  constructor(
    @InjectModel(Messages.name) private messageModel: Model<Messages>,
    @InjectModel(User.name) private userModel: Model<User>,
  ) {}
  getHello(): string {
    return 'Hello World!';
  }

  async saveMessage(createMessageDto: CreateMessageDto): Promise<string> {
    await this.messageModel.create(createMessageDto);
    return 'Message saved';
  }

  async updateSocketIdOfUser(userAndSocketIdDto: {
    userId: string;
    socketId: string;
  }) {
    await this.userModel.findByIdAndUpdate(userAndSocketIdDto.userId, {
      socketId: userAndSocketIdDto.socketId,
    });
    return 'User socketId is updated';
  }

  async findUserById(id: any) {
    const user = await this.userModel.findById(id);
    return user.socketId;
  }
}
