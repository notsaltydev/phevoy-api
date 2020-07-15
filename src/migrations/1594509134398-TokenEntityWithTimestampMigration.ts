import {MigrationInterface, QueryRunner} from "typeorm";

export class TokenEntityWithTimestampMigration1594509134398 implements MigrationInterface {
    name = 'TokenEntityWithTimestampMigration1594509134398'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "token" ADD "timestamp" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "token" DROP COLUMN "timestamp"`, undefined);
    }

}
