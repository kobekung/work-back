import { HttpException, HttpStatus, Injectable, Req } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Member } from 'src/models/member.model';
import {
  AddMemberDto,
  UpdateMemberDto,
  UpdateMemberStatusDto,
} from './dto/member.dto';
import {
  MEMBER_PERISSION_ENUM,
  MEMBER_STATUS_ENUM,
} from 'src/enum/member.status';
import { ENUM_Role } from 'src/enum/role.enum';
import { Op } from 'sequelize';
import { User } from 'src/models/user.model';
import { IProfile } from 'src/interface/ldap.interface';
import { getByName } from 'src/utils/profile';

@Injectable()
export class MemberService {
  constructor(@InjectModel(Member) private repository: typeof Member) {}

  async getMemberByProjectID(
    projectId: number,
    userId: number,
  ): Promise<Member[]> {
    const permission = await this.checkpermissionForProject({
      userId,
      projectId,
      permissionStatus: MEMBER_PERISSION_ENUM.IS_READ,
    });
    if (!permission) {
      throw new HttpException('ไม่มีสิทธ์', HttpStatus.FORBIDDEN);
    }
    //status != 3
    const member = await this.repository.findAll({
      where: {
        projectId: projectId,
        [Op.not]: {
          status: MEMBER_STATUS_ENUM.DENY,
        },
      },
      order: [['id', 'ASC']],
      include: [
        {
          all: true,
        },
      ],
    });
    return member;
  }

  async getMemberByUserId(
    id: number,
    status: MEMBER_STATUS_ENUM,
  ): Promise<Member[]> {
    if (status) {
      return await this.repository.findAll({
        include: [{ all: true }],
        where: { userId: id, status },
      });
    }
    return await this.repository.findAll({
      include: [{ all: true }],
      where: { userId: id },
    });
  }

  async getMemberFromLdapByName(
    name: string,
    token: string,
  ): Promise<IProfile[]> {
    try {
      const users = await getByName(name, token);
      return users;
    } catch (err) {
      throw new HttpException(err.response, err.status);
    }
  }

  async getMemberBySenderId(
    id: number,
  ): Promise<Member[]> {
    return await this.repository.findAll({
      include: [{ all: true }],
      where: { senderId: id , status : MEMBER_STATUS_ENUM.PENDING},
    });
  }
  async createMember(
    member: AddMemberDto,
    permissionStatus: MEMBER_PERISSION_ENUM,
  ): Promise<Member> {
    const t = await this.repository.sequelize.transaction();
    try {
      const permission = await this.checkpermissionForProject({
        userId: member.senderId ? member.senderId : member.userId,
        projectId: member.projectId,
        permissionStatus: permissionStatus,
      });
      if (!permission) {
        throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
      }
      const findMember = await this.repository.findOne({
        where: {
          userId: member.userId,
          projectId: member.projectId,
        },
      });
      if (findMember) {
        throw new HttpException('Member already exists', HttpStatus.CONFLICT);
      }
      const memberCreated = await this.repository.create(member, {
        transaction: t,
      });
      await t.commit();
      return memberCreated;
    } catch (err) {
      await t.rollback();
      throw new HttpException(err.response, err.status);
    }
  }

  async updateMember(
    userId: number,
    member: UpdateMemberDto,
  ): Promise<[affectedCount: number]> {
    const t = await this.repository.sequelize.transaction();
    try {
      const permission = await this.checkpermissionForProject({
        userId: userId,
        projectId: member.projectId,
        permissionStatus: MEMBER_PERISSION_ENUM.IS_UPDATE,
      });
      if (!permission) {
        throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
      }
      const memberUpdated = await this.repository.update(member, {
        where: { id: member.id },
        transaction: t,
      });
      await t.commit();
      return memberUpdated;
    } catch (err) {
      await t.rollback();
      throw new HttpException(err.response, err.status);
    }
  }

  async updateMemberStatus({ id, status, userId }: UpdateMemberStatusDto) {
    const t = await this.repository.sequelize.transaction();
    try {
      const permission = await this.checkpermissionUpdates({ id, userId });
      if (!permission) {
        throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
      }
      const member = await this.repository.update(
        { status },
        { where: { id }, transaction: t },
      );
      await t.commit();
      return member;
    } catch (err) {
      await t.rollback();
      throw new HttpException(err.response, err.status);
    }
  }

  async deleteMember(id: number, userId: number): Promise<String> {
    const t = await this.repository.sequelize.transaction();
    try {
      const getMember = await this.repository.findByPk(id);
      if (!getMember) {
        throw new HttpException('Member not found', HttpStatus.NOT_FOUND);
      }
      const permission = await this.checkpermissionForProject({
        userId: userId,
        projectId: getMember.projectId,
        permissionStatus: MEMBER_PERISSION_ENUM.IS_DELETE,
      });
      if (!permission) {
        throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
      }
      await this.repository.destroy({
        where: { id },
      });
      await t.commit();
      return 'Member Deleted Successfully';
    } catch (err) {
      await t.rollback();
      throw new HttpException(err.response, err.status);
    }
  }

  async countMemberByProjectIdForTableProject(
    projectId: number,
    userId: number,
  ): Promise<number> {
    const permission = await this.checkpermissionForProject({
      userId,
      projectId,
      permissionStatus: MEMBER_PERISSION_ENUM.IS_READ,
    });
    if (!permission) {
      throw new HttpException('ไม่มีสิทธ์', HttpStatus.FORBIDDEN);
    }
    //status != 3
    const member = await this.repository.count({
      where: {
        projectId: projectId,
        status: MEMBER_STATUS_ENUM.ACTIVE,
      },
      include: [
        {
          all: true,
        },
      ],
    });
    return member;
  }

  async checkpermissionForProject({
    userId,
    projectId,
    permissionStatus,
  }: {
    userId: number;
    projectId: number;
    permissionStatus: MEMBER_PERISSION_ENUM;
  }): Promise<boolean> {
    let whereClause: any = {
      userId: userId,
      projectId: projectId,
      status: MEMBER_STATUS_ENUM.ACTIVE,
    };

    if (permissionStatus == MEMBER_PERISSION_ENUM.IS_UPDATE) {
      whereClause.roleId = {
        [Op.or]: [ENUM_Role.Owner, ENUM_Role.PM],
      };
    }

    if (permissionStatus == MEMBER_PERISSION_ENUM.IS_DELETE) {
      whereClause.roleId = {
        [Op.or]: [ENUM_Role.Owner, ENUM_Role.PM],
      };
    }

    if (permissionStatus == MEMBER_PERISSION_ENUM.IS_OWNER) {
      return true;
    }

    const permission = await this.repository.findOne({
      where: whereClause,
    });

    return !!permission;
  }

  checkpermissionUpdates = async ({
    id,
    userId,
    updateRole = false,
  }: {
    id: number;
    userId: number;
    updateRole?: boolean;
  }) => {
    if (updateRole) {
      const member = await this.repository.findOne({
        where: {
          id,
          userId,
          status: MEMBER_STATUS_ENUM.ACTIVE,
          [Op.or]: [{ roleId: ENUM_Role.Owner }, { roleId: ENUM_Role.PM }],
        },
      });
      return !!member;
    }
    const member = await this.repository.findOne({
      where: {
        id,
        userId,
        status: MEMBER_STATUS_ENUM.PENDING,
      },
    });
    return !!member;
  };
}
