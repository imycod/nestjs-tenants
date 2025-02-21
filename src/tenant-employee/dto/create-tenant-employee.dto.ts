import { IsDecimal, IsNotEmpty, IsString, Length, IsNumber, Min, Max, Matches, IsBoolean } from "class-validator";

export class CreateTenantEmployeeDto {
  @IsString()
  @Length(1, 50, { message: "员工姓名长度必须在1-50个字符之间" })
  @IsNotEmpty({ message: "员工姓名不能为空" })
  name: string;

  @IsString()
  @Length(1, 50, { message: "员工编号长度必须在1-50个字符之间" })
  @Matches(/^[A-Za-z0-9-_]+$/, { message: "员工编号只能包含字母、数字、横线和下划线" })
  @IsNotEmpty({ message: "员工编号不能为空" })
  code: string;

  @IsString()
  @Length(1, 100, { message: "部门名称长度必须在1-100个字符之间" })
  department: string;

  @IsString()
  @Length(1, 100, { message: "职位名称长度必须在1-100个字符之间" })
  position: string;

  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0, { message: "薪资不能为负数" })
  @Max(9999999.99, { message: "薪资超出范围" })
  salary: number;

  @IsBoolean()
  isActive: boolean;
}