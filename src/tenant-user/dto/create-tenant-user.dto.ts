import { IsString, IsEmail, IsOptional, IsArray, IsBoolean, IsObject } from 'class-validator';

export class CreateTenantUserDto {
  @IsString()
  username: string;

  @IsString()
  password: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsArray()
  @IsOptional()
  roles?: string[];

  @IsObject()
  @IsOptional()
  permissions?: Record<string, any>;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean; // 是否在职
}

