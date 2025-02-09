import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getModelToken } from '@nestjs/mongoose';
import { User } from './schemas/users.schema';
import * as bcryptjs from 'bcryptjs';

describe('UsersService', () => {
  let service: UsersService;
  let userModel: any;

  const fakeUser = {
    _id: '1',
    name: 'Test User',
    email: 'test@example.com',
    password: 'hashedPassword',
  };

  const mockUserModelConstructor = jest.fn().mockImplementation((dto) => {
    return {
      ...dto,
      save: jest.fn().mockResolvedValue({
        _id: '1',
        ...dto,
        password: 'hashedPassword',
      }),
    };
  });

  (mockUserModelConstructor as any).findOne = jest.fn().mockReturnValue({
    exec: jest.fn().mockResolvedValue(fakeUser),
    select: jest.fn().mockReturnValue({
      exec: jest.fn().mockResolvedValue(fakeUser),
    }),
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getModelToken(User.name),
          useValue: mockUserModelConstructor,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    userModel = module.get(getModelToken(User.name));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should hash the password and create a new user', async () => {
      const createUserDto = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'plainPassword',
      };

      const saltSpy = jest.spyOn(bcryptjs, 'genSalt').mockResolvedValue('salt');
      const hashSpy = jest.spyOn(bcryptjs, 'hash').mockResolvedValue('hashedPassword');

      const result = await service.create(createUserDto);

      expect(hashSpy).toHaveBeenCalledWith('plainPassword', 'salt');

      expect(userModel).toHaveBeenCalledWith({
        name: 'Test User',
        email: 'test@example.com',
        password: 'hashedPassword',
      });

      expect(result).toEqual({
        _id: '1',
        name: 'Test User',
        email: 'test@example.com',
        password: 'hashedPassword',
      });
    });
  });

  describe('findOneByEmail', () => {
    it('should return a user without password', async () => {
      const result = await service.findOneByEmail('test@example.com');
      expect(userModel.findOne).toHaveBeenCalledWith({ email: 'test@example.com' });
      expect(result).toEqual(fakeUser);
    });
  });

  describe('findByEmailWithPassword', () => {
    it('should return a user with password', async () => {
      const result = await service.findByEmailWithPassword('test@example.com');
      expect(userModel.findOne).toHaveBeenCalledWith({ email: 'test@example.com' });
      expect(result).toEqual(fakeUser);
    });
  });
});
