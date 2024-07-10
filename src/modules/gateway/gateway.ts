import { Injectable, OnModuleInit } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server } from "socket.io";
import { User } from "src/models/user.model";

@Injectable()
@WebSocketGateway({
    cors: {
        origin: ['*'],
    },
})
export class Gateway implements OnModuleInit {
    @WebSocketServer()
    server: Server

    constructor(@InjectModel(User) private repository: typeof User) {}

    onModuleInit() {
        this.server.on('connection', (socket) => {
            socket.on('register', async (userId: number) => {
                try {
                    await this.repository.update({ socketId: socket.id }, { where: { id: Number(userId) }});
                } catch (err) {
                    throw new Error(err);
                }
            });

            socket.on('disconnect', async () => {
                try {
                    const user = await this.repository.findOne({ where: { socketId: socket.id } });
                    if (user) {
                        await this.repository.update({ socketId: null }, {where: { id: user.id }});
                        console.log(`User ${user.id} disconnected`);
                    }
                } catch (err) {
                    throw new Error(err);
                }
            });
        });
    }

    @SubscribeMessage('invite')
    async handleInviteEvent(@MessageBody() userId: number) {
        try {
            const receiver = await this.repository.findByPk(Number(userId));
            if (receiver && receiver.socketId) {
                this.server.to(receiver.socketId).emit('newInvite', "new Invite");
            }
        } catch (err) {
            throw new Error(err);
        }
    }
} 