import {MigrationInterface, QueryRunner} from "typeorm";

export class TokenEntityWithTypeMigration1594569029061 implements MigrationInterface {
    name = 'TokenEntityWithTypeMigration1594569029061'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "token_type_enum" AS ENUM('email', 'password')`, undefined);
        await queryRunner.query(`ALTER TABLE "token" ADD "type" "token_type_enum" NOT NULL DEFAULT 'email'`, undefined);
        await queryRunner.query(`ALTER TABLE "token" ALTER COLUMN "timestamp" DROP DEFAULT`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "token" ALTER COLUMN "timestamp" SET DEFAULT now()`, undefined);
        await queryRunner.query(`ALTER TABLE "token" DROP COLUMN "type"`, undefined);
        await queryRunner.query(`DROP TYPE "token_type_enum"`, undefined);
    }

}
