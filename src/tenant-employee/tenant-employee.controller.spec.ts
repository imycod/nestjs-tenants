import { Test, TestingModule } from '@nestjs/testing';
import { TenantEmployeeController } from './tenant-employee.controller';
import { TenantEmployeeService } from './tenant-employee.service';

describe('TenantEmployeeController', () => {
  let controller: TenantEmployeeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TenantEmployeeController],
      providers: [TenantEmployeeService],
    }).compile();

    controller = module.get<TenantEmployeeController>(TenantEmployeeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
