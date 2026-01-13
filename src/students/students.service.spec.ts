import { Test, TestingModule } from '@nestjs/testing';
import { StudentsService } from './students.service';
import { Student } from './entities/student.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import * as fc from 'fast-check';

describe('StudentsService', () => {
  let service: StudentsService;
  let mockRepo: any;

  beforeEach(async () => {
    mockRepo = {
      create: jest.fn(),
      save: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StudentsService,
        { provide: getRepositoryToken(Student), useValue: mockRepo },
      ],
    }).compile();
    service = module.get<StudentsService>(StudentsService);
  });

  it('학생 생성 테스트(create)', async () => {
    const createDto = {
      name: '임창종',
      email: 'limchangjong453@naver.com',
      age: 28,
      isActive: true,
    };
    mockRepo.create.mockReturnValue(createDto); // create 함수가 실행되면 createDto를 반환
    mockRepo.save.mockResolvedValue({ ...createDto, id: 1, isActive: true }); // save 함수가 실행되면 Promise

    const result = await service.create(createDto);
    expect(result).toEqual({ ...createDto, id: 1, isActive: true });

    expect(mockRepo.create).toHaveBeenCalledWith(createDto);
  });

  it('학생 생성 테스트 - 패스트 체크 버전', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.record({
          name: fc.string({ minLength: 1, maxLength: 50 }),
          email: fc.emailAddress(),
          age: fc.integer({ min: 1, max: 100 }),
          isActive: fc.boolean(),
        }),
        fc.integer({ min: 1, max: 10000 }),
        async (dto, id) => {
          mockRepo.create.mockReturnValue(dto);
          mockRepo.save.mockResolvedValue({
            ...dto,
            id,
            isActive: true,
          });

          console.log(dto);
          const result = await service.create(dto);

          expect(result).toHaveProperty('id');
          expect(result).toHaveProperty('isActive');
          expect(result.name).toBe(dto.name);
          expect(result.email).toBe(dto.email);
          expect(result.age).toBe(dto.age);
          expect(mockRepo.create).toHaveBeenCalledWith(dto);
        },
      ),
    );
  });
});
