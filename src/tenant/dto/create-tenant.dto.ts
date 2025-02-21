import { IsString, IsNotEmpty, IsBoolean, IsOptional } from 'class-validator';

export class CreateTenantDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  subdomain: string;

  @IsString()
  @IsNotEmpty()
  schema: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}