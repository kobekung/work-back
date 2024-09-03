import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Member } from 'src/models/member.model';
import {
  MEMBER_PERISSION_ENUM,
  MEMBER_STATUS_ENUM,
} from 'src/enum/member.status';
import { ENUM_Role } from 'src/enum/role.enum';
import { Op } from 'sequelize';
import { IWorker } from 'src/interface/models/worker.model';
import { Worker } from 'src/models/worker.model';
import { AddWorkerDto } from './dto/worker.dto';

@Injectable()
export class WorkerService {
  constructor(
    @InjectModel(Member) private repository: typeof Member,
    @InjectModel(Worker) private Workerrepository: typeof Worker,
  ) {}

  async getWorkerByTaskID(
    id: number,
  ): Promise<IWorker[]> {
    // const permission = await this.checkpermissionForProject({
    //   userId,
    //   taskId,
    //   permissionStatus: MEMBER_PERISSION_ENUM.IS_READ,
    // });
    // if (!permission) {
    //   throw new HttpException('ไม่มีสิทธ์', HttpStatus.FORBIDDEN);
    // }
    const worker = await this.Workerrepository.findAll({
      where: {
        taskId: id,
      },
      order: [['id', 'ASC']],
      include: [
        {
          all: true,
        },
      ],
    });
    return worker;
  }

  // async getMemberByUserId(
  //   id: number,
  //   status: MEMBER_STATUS_ENUM,
  // ): Promise<Member[]> {
  //   if (status) {
  //     return await this.repository.findAll({
  //       include: [{ all: true }],
  //       where: { userId: id, status },
  //     });
  //   }
  //   return await this.repository.findAll({
  //     include: [{ all: true }],
  //     where: { userId: id },
  //   });
  // }

  // async getMemberFromLdapByName(
  //   name: string,
  //   token: string,
  // ): Promise<IProfile[]> {
  //   try {
  //     const users = await getByName(name, token);
  //     return users;
  //   } catch (err) {
  //     throw new HttpException(err.response, err.status);
  //   }
  // }

  // async getMemberBySenderId(id: number): Promise<Member[]> {
  //   return await this.repository.findAll({
  //     include: [{ all: true }],
  //     where: { senderId: id, status: MEMBER_STATUS_ENUM.PENDING },
  //   });
  // }
  async createWorker(
    worker: AddWorkerDto,
    // permissionStatus: MEMBER_PERISSION_ENUM,
  ): Promise<Worker> {
    const t = await this.Workerrepository.sequelize.transaction();
    try {
      // const permission = await this.checkpermissionForProject({
      //   userId: worker.senderId ? worker.senderId : worker.userId,
      //   taskId: worker.taskId,
      //   permissionStatus: permissionStatus,
      // });
      // if (!permission) {
      //   throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
      // }
      const findWorker = await this.Workerrepository.findOne({
        where: {
          userId: worker.userId,
          taskId: worker.taskId,
        },
      });
      if (findWorker) {
        throw new HttpException('Worker already exists', HttpStatus.CONFLICT);
      }
      const workerCreated = await this.Workerrepository.create(worker, {
        transaction: t,
      });
      await t.commit();
      return workerCreated;
    } catch (err) {
      await t.rollback();
      throw new HttpException(err.response, err.status);
    }
  }

  // async updateMember(
  //   userId: number,
  //   worker: UpdateMemberDto,
  // ): Promise<[affectedCount: number]> {
  //   const t = await this.repository.sequelize.transaction();
  //   try {
  //     const permission = await this.checkpermissionForProject({
  //       userId: userId,
  //       projectId: member.projectId,
  //       permissionStatus: MEMBER_PERISSION_ENUM.IS_UPDATE,
  //     });
  //     if (!permission) {
  //       throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
  //     }
  //     const memberUpdated = await this.repository.update(member, {
  //       where: { id: member.id },
  //       transaction: t,
  //     });
  //     await t.commit();
  //     return memberUpdated;
  //   } catch (err) {
  //     await t.rollback();
  //     throw new HttpException(err.response, err.status);
  //   }
  // }

  // async updateMemberStatus({ id, status, userId }: UpdateMemberStatusDto) {
  //   const t = await this.repository.sequelize.transaction();
  //   try {
  //     const permission = await this.checkpermissionUpdates({ id, userId });
  //     if (!permission) {
  //       throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
  //     }
  //     const member = await this.repository.update(
  //       { status },
  //       { where: { id }, transaction: t },
  //     );
  //     await t.commit();
  //     return member;
  //   } catch (err) {
  //     await t.rollback();
  //     throw new HttpException(err.response, err.status);
  //   }
  // }

  async deleteWorker(id: number): Promise<String> {
    const t = await this.Workerrepository.sequelize.transaction();
    try {
      const getWorker = await this.Workerrepository.findByPk(id);
      if (!getWorker) {
        throw new HttpException('Member not found', HttpStatus.NOT_FOUND);
      }
      // const permission = await this.checkpermissionForProject({
      //   userId: userId,
      //   projectId: getMember.projectId,
      //   permissionStatus: MEMBER_PERISSION_ENUM.IS_DELETE,
      // });
      // if (!permission) {
      //   throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
      // }
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

  // async countMemberByProjectIdForTableProject(
  //   projectId: number,
  //   userId: number,
  // ): Promise<number> {
  //   const permission = await this.checkpermissionForProject({
  //     userId,
  //     projectId,
  //     permissionStatus: MEMBER_PERISSION_ENUM.IS_READ,
  //   });
  //   if (!permission) {
  //     throw new HttpException('ไม่มีสิทธ์', HttpStatus.FORBIDDEN);
  //   }
  //   //status != 3
  //   const member = await this.repository.count({
  //     where: {
  //       projectId: projectId,
  //       status: MEMBER_STATUS_ENUM.ACTIVE,
  //     },
  //     include: [
  //       {
  //         all: true,
  //       },
  //     ],
  //   });
  //   return member;
  // }

  // async checkpermissionForProject({
  //   userId,
  //   taskId,
  //   permissionStatus,
  // }: {
  //   userId: number;
  //   taskId: number;
  //   permissionStatus: MEMBER_PERISSION_ENUM;
  // }): Promise<boolean> {
  //   let whereClause: any = {
  //     userId: userId,
  //     taskId: taskId,
  //     status: MEMBER_STATUS_ENUM.ACTIVE,
  //   };

  //   if (permissionStatus == MEMBER_PERISSION_ENUM.IS_UPDATE) {
  //     whereClause.roleId = {
  //       [Op.or]: [ENUM_Role.Owner, ENUM_Role.PM],
  //     };
  //   }

  //   if (permissionStatus == MEMBER_PERISSION_ENUM.IS_DELETE) {
  //     whereClause.roleId = {
  //       [Op.or]: [ENUM_Role.Owner, ENUM_Role.PM],
  //     };
  //   }

  //   if (permissionStatus == MEMBER_PERISSION_ENUM.IS_OWNER) {
  //     return true;
  //   }

  //   const permission = await this.repository.findOne({
  //     where: whereClause,
  //   });

  //   return !!permission;
  // }

  // checkpermissionUpdates = async ({
  //   id,
  //   userId,
  //   updateRole = false,
  // }: {
  //   id: number;
  //   userId: number;
  //   updateRole?: boolean;
  // }) => {
  //   if (updateRole) {
  //     const member = await this.repository.findOne({
  //       where: {
  //         id,
  //         userId,
  //         status: MEMBER_STATUS_ENUM.ACTIVE,
  //         [Op.or]: [{ roleId: ENUM_Role.Owner }, { roleId: ENUM_Role.PM }],
  //       },
  //     });
  //     return !!member;
  //   }
  //   const member = await this.repository.findOne({
  //     where: {
  //       id,
  //       userId,
  //       status: MEMBER_STATUS_ENUM.PENDING,
  //     },
  //   });
  //   return !!member;
  // };
}
