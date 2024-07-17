import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { User } from 'src/models/user.model';

@Injectable()
@WebSocketGateway({
  cors: {
    origin: ['http://localhost:5173'],
  },
})
export class Gateway implements OnModuleInit {
  @WebSocketServer()
  server: Server;

  constructor(@InjectModel(User) private repository: typeof User) {}

  onModuleInit() {
    this.server.on('connection', (socket) => {
      socket.on('register', async (userIdp: string) => {
        try {
          await this.repository.update(
            { socketId: socket.id },
            { where: { idp: userIdp } },
          );
        } catch (err) {
          throw new Error(err);
        }
      });

      socket.on('disconnect', async () => {
        try {
          const user = await this.repository.findOne({
            where: { socketId: socket.id },
          });
          if (user) {
            await this.repository.update(
              { socketId: null },
              { where: { idp: user.idp } },
            );
          }
        } catch (err) {
          throw new Error(err);
        }
      });
    });
  }

  @SubscribeMessage('invite')
  async handleInviteEvent(
    @MessageBody()
    inviteDetail: {
      userIdp: string;
      projectId: number;
      roleId: number;
    },
  ) {
    try {
      const receiver = await this.repository.findOne({
        where: {
          idp: inviteDetail.userIdp,
        },
      });
      if (receiver && receiver.socketId) {
        this.server.to(receiver.socketId).emit('newInvite', inviteDetail);
      }
    } catch (err) {
      throw new Error(err);
    }
  }
}
