import { IsOptional } from "class-validator";
import { Column, Entity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from "typeorm";

@Entity('employees')  // 改为更准确的表名
export class TenantEmployee {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 50 })
  name: string;

  @Column({ length: 50, unique: true })
  code: string;

  @Column({ length: 100 })
  @IsOptional()
  department: string;

  @Column({ length: 100 })
  @IsOptional()
  position: string;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    default: 0
  })
  @IsOptional()
  salary: number;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
