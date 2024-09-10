import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { User } from 'src/models/user.model';
import { LoginDto } from '../dto/user.dto';
import { getModelToken } from '@nestjs/sequelize';

describe('UserService', () => {
  let service: UserService;
  let model: typeof User;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getModelToken(User),
          useValue: {
            create: jest.fn().mockResolvedValue({}),
            sequelize: {
              transaction: jest.fn().mockReturnValue({
                commit: jest.fn(),
                rollback: jest.fn(),
              }),
            },
          },
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    model = module.get<typeof User>(getModelToken(User));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a user and commit transaction', async () => {
    const loginDto: LoginDto = {
      username: 'test',
      password: 'password',
    };

    const transaction = await model.sequelize.transaction();
    const commitSpy = jest.spyOn(transaction, 'commit');
    const rollbackSpy = jest.spyOn(transaction, 'rollback');

    const result = await service.create(loginDto);

    expect(result).toEqual(loginDto);
    expect(commitSpy).toHaveBeenCalled();
    expect(rollbackSpy).not.toHaveBeenCalled();
  });

  it('should rollback transaction on error', async () => {
    const loginDto: LoginDto = {
      username: 'test',
      password: 'password',
    };

    const transaction = await model.sequelize.transaction();
    jest
      .spyOn(model, 'create')
      .mockRejectedValue(new Error('Failed to create user'));
    const commitSpy = jest.spyOn(transaction, 'commit');
    const rollbackSpy = jest.spyOn(transaction, 'rollback');

    await expect(service.create(loginDto)).rejects.toThrow(
      'Failed to create user',
    );
    expect(commitSpy).not.toHaveBeenCalled();
    expect(rollbackSpy).toHaveBeenCalled();
  });
});
