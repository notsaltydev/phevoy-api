import { MigrationInterface, QueryRunner } from "typeorm";

export class RemoveScheduleEntityMigration1588021336808 implements MigrationInterface {
    name = 'RemoveScheduleEntityMigration1588021336808'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "conference" DROP CONSTRAINT "FK_899cde128a040462b0a9a5d7845"`, undefined);
        await queryRunner.query(`ALTER TABLE "conference" DROP COLUMN "scheduleId"`, undefined);
        await queryRunner.query(`DROP TABLE "schedule"`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "conference" ADD "scheduleId" uuid`, undefined);
        await queryRunner.query(`ALTER TABLE "conference" ADD CONSTRAINT "FK_899cde128a040462b0a9a5d7845" FOREIGN KEY ("scheduleId") REFERENCES "schedule"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
    }

}
