import { MigrationInterface, QueryRunner } from "typeorm";

export class RemoveLogsTable1740033718665 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS "logs";`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE "logs" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "tenantId" character varying NOT NULL,
                "level" character varying NOT NULL,
                "message" text NOT NULL,
                "meta" jsonb,
                "requestMethod" character varying,
                "requestPath" character varying,
                "requestHeaders" jsonb,
                "requestBody" jsonb,
                "responseTime" float,
                "responseBody" jsonb,
                "statusCode" integer,
                "error" character varying,
                "stack" character varying,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_logs" PRIMARY KEY ("id")
            );
        `);
  }
}