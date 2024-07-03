import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Member } from 'src/models/member.model';
import { AddMemberDto } from './dto/member.dto';

@Injectable()
export class MemberService {
  constructor(@InjectModel(Member) private repository: typeof Member) {}

  async getMemberByProjectID(id:number): Promise<Member[]> {
    return await this.repository.findAll({
      where: {
        projectId: id,
      },
    });
  }

  async getMemberById(id: number): Promise<Member> {
    return await this.repository.findByPk(id);
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
}
