import {MigrationInterface, QueryRunner} from "typeorm";

export class DateTimeFormat1587932171385 implements MigrationInterface {
    name = 'DateTimeFormat1587932171385'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "schedule" DROP COLUMN "date"`, undefined);
        await queryRunner.query(`ALTER TABLE "schedule" ADD "date" date NOT NULL`, undefined);
        await queryRunner.query(`ALTER TABLE "conference" DROP COLUMN "startDate"`, undefined);
        await queryRunner.query(`ALTER TABLE "conference" ADD "startDate" TIMESTAMP WITH TIME ZONE NOT NULL`, undefined);
        await queryRunner.query(`ALTER TABLE "conference" DROP COLUMN "endDate"`, undefined);
        await queryRunner.query(`ALTER TABLE "conference" ADD "endDate" TIMESTAMP WITH TIME ZONE NOT NULL`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "conference" DROP COLUMN "endDate"`, undefined);
        await queryRunner.query(`ALTER TABLE "conference" ADD "endDate" TIMESTAMP NOT NULL DEFAULT now()`, undefined);
        await queryRunner.query(`ALTER TABLE "conference" DROP COLUMN "startDate"`, undefined);
        await queryRunner.query(`ALTER TABLE "conference" ADD "startDate" TIMESTAMP NOT NULL DEFAULT now()`, undefined);
        await queryRunner.query(`ALTER TABLE "schedule" DROP COLUMN "date"`, undefined);
        await queryRunner.query(`ALTER TABLE "schedule" ADD "date" TIMESTAMP NOT NULL DEFAULT now()`, undefined);
    }

}
