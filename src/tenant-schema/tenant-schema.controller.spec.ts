import { Test, TestingModule } from '@nestjs/testing';
import { TenantSchemaController } from './tenant-schema.controller';
import { TenantSchemaService } from './tenant-schema.service';

describe('TenantSchemaController', () => {
  let controller: TenantSchemaController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TenantSchemaController],
      providers: [TenantSchemaService],
    }).compile();

    controller = module.get<TenantSchemaController>(TenantSchemaController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
