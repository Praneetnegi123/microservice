import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
} from '@nestjs/websockets';
import { SocketService } from './socket.service';
import { Server } from 'socket.io';
import { Inject, OnModuleInit } from '@nestjs/common';
import { CreateMessageDto } from './dto/Create-message.dto';

@WebSocketGateway()
export class SocketGateway implements OnModuleInit {
  constructor(private readonly socketService: SocketService) {}
  @WebSocketServer()
  server: Server;

  onModuleInit() {
    this.server.on('connection', async (socket) => {
      // update socketId of user
      this.socketService.updateSocketIdOfUser({
        userId: `${socket.handshake.query.userId}`,
        socketId: `${socket.id}`,
      });

      console.log(
        'New user connected=>',
        socket.id,
        socket.handshake.query.userId,
      );
      socket.on('disconnect', async () => {
        // update socketId of user
        this.socketService.updateSocketIdOfUser({
          userId: `${socket.handshake.query.userId}`,
          socketId: ``,
        });
        console.log('user disconnected=>', socket.id);
      });
    });
  }

  @SubscribeMessage('msgToServer')
  async msgToServer(@MessageBody() payload: CreateMessageDto) {
    // save the message in the db
    this.socketService.saveMessage(payload);
    // fetch the socketId from userId
    const socketId = await this.socketService.findUserById(payload.to);
    // send message to the user
    this.server.to(socketId).emit('msgToClient', {
      message: payload.message,
    });
  }
}
