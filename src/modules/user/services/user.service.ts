import { Injectable } from '@nestjs/common';
import { User } from 'src/models/user.model';
import { LoginDto } from '../dto/user.dto';
import { InjectModel } from '@nestjs/sequelize';
import axios from 'axios';

@Injectable()
export class UserService {
  constructor(@InjectModel(User) private repository: typeof User) {}

  async create(user: LoginDto) {
    const t = await this.repository.sequelize.transaction();
    try {
      const loginToLdap = axios.post('http://localhost:3000/auth', {});
      //   const payload = {
      //     idp: user.idp,
      //     email: user.email,
      //     firstName: user.firstName,
      //     lastName: user.lastName,
      //     token: user.token,
      //     refreshToken: user.refreshToken,
      //   } as IUser;
      //   const userCreated = await this.repository.create(payload, {
      //     transaction: t,
      //   });
      await t.commit();
      return user;
    } catch (err) {
      await t.rollback();
      throw new Error(err);
    }
  }
}
