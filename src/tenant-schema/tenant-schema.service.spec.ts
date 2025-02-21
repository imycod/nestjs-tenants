import { Test, TestingModule } from '@nestjs/testing';
import { TenantSchemaService } from './tenant-schema.service';

describe('TenantSchemaService', () => {
  let service: TenantSchemaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TenantSchemaService],
    }).compile();

    service = module.get<TenantSchemaService>(TenantSchemaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
