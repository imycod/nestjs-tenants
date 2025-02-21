
import { IsString, IsArray, IsOptional, ValidateNested, IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';

export class ColumnDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  type: string;

  @IsArray()
  @IsOptional()
  constraints?: string[];
}

export class TableDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @ValidateNested({ each: true })
  @Type(() => ColumnDto)
  @IsArray()
  columns: ColumnDto[];
}

export class CreateTenantSchemaDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsNotEmpty()
  schema: string;

  @ValidateNested({ each: true })
  @Type(() => TableDto)
  @IsArray()
  tables: TableDto[];
}
