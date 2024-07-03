import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { User } from 'src/models/user.model';
import { LoginDto } from '../dto/user.dto';
import { InjectModel } from '@nestjs/sequelize';
import axios from 'axios';
import * as dotenv from 'dotenv';
import { getProfile } from 'src/utils/profile';
import { ILdapResponse, IProfile } from 'src/interface/ldap.interface';
import { IUser } from 'src/interface/models/user.model';

dotenv.config();

@Injectable()
export class UserService {
  constructor(@InjectModel(User) private repository: typeof User) {}

  async create(user: LoginDto) {
    const t = await this.repository.sequelize.transaction();
    try {
      const loginToLdap: ILdapResponse = (
        await axios.post(process.env.LDAP_URL, user)
      ).data;
      const profile: IProfile = await getProfile(loginToLdap.token);

      //check exception
      const isException = await this.checkException(profile.idp);
      if (isException) {
        throw new HttpException(
          { data: 'User already exists', status: HttpStatus.BAD_REQUEST },
          HttpStatus.BAD_REQUEST,
        );
      }
      const payload = {
        idp: profile.idp,
        email: profile.email,
        firstName: profile.firstnameEng,
        lastName: profile.lastnameEng,
        token: loginToLdap.token,
        refreshToken: loginToLdap.refreshToken,
      } as IUser;
      const userCreated = await this.repository.create(payload, {
        transaction: t,
      });
      await t.commit();
      return userCreated;
    } catch (err) {
      await t.rollback();
      throw new HttpException(err.response.data, err.response.status);
    }
  }

  async checkException(idp: string): Promise<boolean> {
    const user = await this.repository.findOne({ where: { idp } });
    return !!user;
  }
}
