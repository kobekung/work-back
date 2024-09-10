import { HttpException } from '@nestjs/common';
import axios from 'axios';
import * as dotenv from 'dotenv';

dotenv.config();

export const getProfile = async (token: string) => {
  try {
    const profile = await axios.get(process.env.LDAP_PROFILE, {
      headers: {
        Authorization: token,
      },
    });
    return profile.data;
  } catch (err) {
    throw new HttpException(err.response.data, err.response.status);
  }
};

export const refreshToken = async (refreshToken: string) => {
  try {
    const token = await axios.post(process.env.LDAP_REFRESH_TOKEN, null, {
      headers: {
        Authorization: refreshToken,
        Platform: 'web',
      },
    });
    return token.data;
  } catch (err) {
    throw new HttpException(err.response.data, err.response.status);
  }
};
export const getUnit = async (token: string) => {
  try {
    const unit = await axios.get(process.env.LDAP_UNIT, {
      headers: {
        Authorization: token,
      },
    });
    return unit.data;
  } catch (err) {
    throw new HttpException(err.response.data, err.response.status);
  }
};

export const verifyToken = async (token: string) => {
  try {
    const verify = await axios.post(process.env.LDAP_VERIFY, null, {
      headers: {
        Authorization: token,
      },
    });
    return verify.data;
  } catch (err) {
    throw new HttpException(err.response.data, err.response.status);
  }
};

export const getByIdp = async (idp: string, token) => {
  try {
    const user = await axios.get(process.env.LDAP_IDP + '/' + idp, {
      headers: {
        Authorization: token,
      },
    });
    return user.data;
  } catch (err) {
    throw new HttpException(err.response.data, err.response.status);
  }
};
export const getByName = async (name: string, token) => {
  try {
    const user = await axios.get(process.env.LDAP_NAME + '?name=' + name, {
      headers: {
        Authorization: token,
      },
    });
    return user.data;
  } catch (err) {
    throw new HttpException(err.response.data, err.response.status);
  }
};
