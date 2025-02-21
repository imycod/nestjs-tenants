import { Test, TestingModule } from '@nestjs/testing';
import { TenantEmployeeService } from './tenant-employee.service';

describe('TenantEmployeeService', () => {
  let service: TenantEmployeeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TenantEmployeeService],
    }).compile();

    service = module.get<TenantEmployeeService>(TenantEmployeeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
