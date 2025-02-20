import { Entity, ObjectIdColumn, Column, ObjectId, BeforeInsert } from 'typeorm';
import * as moment from 'moment-timezone';

@Entity('logs', { database: 'mongodb' })
export class Log {
  @ObjectIdColumn()
  id: ObjectId;

  @Column()
  tenantId: string;

  @Column()
  level: string;

  @Column()
  message: string;

  @Column({ nullable: true })
  meta?: any;

  @Column({ nullable: true })
  requestMethod?: string;

  @Column({ nullable: true })
  requestPath?: string;

  @Column({ nullable: true })
  requestHeaders?: Record<string, any>;

  @Column({ nullable: true })
  requestBody?: Record<string, any>;

  @Column({ nullable: true })
  responseTime?: number;

  @Column({ nullable: true })
  responseBody?: any;

  @Column({ nullable: true })
  statusCode?: number;

  @Column({ nullable: true })
  error?: string;

  @Column({ nullable: true })
  stack?: string;

  @Column()
  createdAt: Date;

  // @BeforeInsert()
  // updateCreatedAt() {
  //   this.createdAt = moment().tz('Asia/Shanghai').toDate();
  // }
}