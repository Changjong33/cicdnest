import { Test, TestingModule } from '@nestjs/testing';
import { StudentsController } from './students.controller';
import { StudentsService } from './students.service';
import { Student } from './entities/student.entity';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('StudentsController', () => {
  let controller: StudentsController;
  let mockRepo: any;

  beforeEach(async () => {
    mockRepo = {
      create: jest.fn(),
      save: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [StudentsController],
      providers: [
        StudentsService,
        { provide: getRepositoryToken(Student), useValue: mockRepo },
      ],
    }).compile();

    controller = module.get<StudentsController>(StudentsController);
  });

  it('학생 fineOne get', () => {
    expect(controller.findOne('10')).toBe('학생 10');
  });
});
