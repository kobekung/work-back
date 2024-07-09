import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Member } from 'src/models/member.model';
import { AddMemberDto } from './dto/member.dto';
import { MEMBER_STATUS_ENUM } from 'src/enum/member.status';
import { ENUM_Role } from 'src/enum/role.enum';
import { Op } from 'sequelize';

@Injectable()
export class MemberService {
  constructor(@InjectModel(Member) private repository: typeof Member) {}

  async getMemberByProjectID(
    projectId: number,
    userId: number,
  ): Promise<Member[]> {
    const permission = await this.checkpermission({ userId, projectId });
    if (!permission) {
      throw new HttpException('ไม่มีสิทธ์', HttpStatus.FORBIDDEN);
    }
    const member = await this.repository.findAll({
      where: {
        projectId: projectId,
      },
      include: [
        {
          all: true,
        },
      ],
    });
    return member;
  }

  async getMemberByUserId(id: number): Promise<Member[]> {
    return await this.repository.findAll({
      where: { userId: id },
    });
  }

  async createMember(member: AddMemberDto) {
    const t = await this.repository.sequelize.transaction();
    try {
      await this.repository.create(member, {
        transaction: t,
      });
      await t.commit();
      return 'Add Member Successfully';
    } catch (err) {
      await t.rollback();
      throw new Error(err);
    }
  }

  async updateMember(id: number, member: AddMemberDto) {
    const t = await this.repository.sequelize.transaction();
    try {
      await this.repository.update(member, { where: { id } });
      await t.commit();
      return 'Project Updated Successfully';
    } catch (err) {
      await t.rollback();
      throw new Error(err);
    }
  }

  async deleteMember(id: number): Promise<String> {
    const t = await this.repository.sequelize.transaction();
    try {
      await this.repository.destroy({
        where: { id },
      });
      await t.commit();
      return 'Project Deleted Successfully';
    } catch (err) {
      await t.rollback();
      throw new Error(err);
    }
  }

  async checkpermission({
    userId,
    projectId,
    isUpdate = false,
  }: {
    userId: number;
    projectId: number;
    isUpdate?: boolean;
  }): Promise<boolean> {
    let whereClause: any = {
      userId: userId,
      projectId: projectId,
      status: MEMBER_STATUS_ENUM.ACTIVE,
    };

    if (!isUpdate) {
      whereClause.roleId = {
        [Op.or]: [ENUM_Role.Owner],
      };
    }
    const permission = await this.repository.findOne({
      where: whereClause,
    });

    return !!permission;
  }
}
