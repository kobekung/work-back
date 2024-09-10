import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { User } from 'src/models/user.model';
import { LoginDto } from '../dto/user.dto';
import { InjectModel } from '@nestjs/sequelize';
import axios from 'axios';
import * as dotenv from 'dotenv';
import { getByIdp, getProfile, refreshToken } from 'src/utils/profile';
import {
  ILdapRefreshTokenResponse,
  ILdapResponse,
  IProfile,
} from 'src/interface/ldap.interface';
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
        await this.repository.update(
          { token: loginToLdap.token, refreshToken: loginToLdap.refreshToken },
          { where: { idp: profile.idp }, transaction: t },
        );
        isException.token = loginToLdap.token;
        isException.refreshToken = loginToLdap.refreshToken;
        await t.commit();
        return isException;
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
      console.log(err);
      await t.rollback();
      throw new HttpException(err.response.data, err.response.status);
    }
  }

  async checkException(idp: string): Promise<User> {
    const user = await this.repository.findOne({ where: { idp } });
    return user;
  }

  async getUserByToken(token: string): Promise<IUser> {
    try {
      if (!token) {
        throw new HttpException('Token is required', HttpStatus.BAD_REQUEST);
      }
      const user = await this.repository.findOne({ where: { token } });
      if (!user) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }
      return user;
    } catch (err) {
      throw new HttpException(err.response, err.status);
    }
  }

  async refreshTokenLdap(token: string): Promise<ILdapRefreshTokenResponse> {
    const t = await this.repository.sequelize.transaction();
    try {
      const user = await this.repository.findOne({
        where: { refreshToken: token },
      });
      if (!user) {
        throw new HttpException(
          { data: 'User not found', status: HttpStatus.NOT_FOUND },
          HttpStatus.NOT_FOUND,
        );
      }
      const loginToLdap: ILdapRefreshTokenResponse = await refreshToken(token);
      await this.repository.update(
        {
          token: loginToLdap.accessToken,
          refreshToken: loginToLdap.refreshToken,
        },
        { where: { idp: user.idp }, transaction: t },
      );
      await t.commit();
      return loginToLdap;
    } catch (err) {
      if (err.response && err.response.data) {
        throw new HttpException(err.response.data, err.response.status);
      } else {
        throw new HttpException(err.response, err.status);
      }
    }
  }

  getUserByIdp = async (idp: string, token: string): Promise<User> => {
    const user = await this.repository.findOne({ where: { idp } });
    if (user) return user;

    const profile = await getByIdp(idp, token);
    if (!profile) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    const payload = {
      idp: profile.idp,
      email: profile.email,
      firstName: profile.firstnameEng,
      lastName: profile.lastnameEng,
    } as IUser;

    const userCreated = await this.repository.create(payload);
    return userCreated;
  };
}
