import {MigrationInterface, QueryRunner} from "typeorm";

export class CreateTokenEntityMigration1594507320953 implements MigrationInterface {
    name = 'CreateTokenEntityMigration1594507320953'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "token" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "token" uuid NOT NULL, "status" character varying, "createdOn" TIMESTAMP NOT NULL DEFAULT now(), "updatedOn" TIMESTAMP NOT NULL DEFAULT now(), "ownerId" uuid, CONSTRAINT "PK_82fae97f905930df5d62a702fc9" PRIMARY KEY ("id"))`, undefined);
        await queryRunner.query(`ALTER TABLE "token" ADD CONSTRAINT "FK_d6f364e68fe0ddc4b826be7c27f" FOREIGN KEY ("ownerId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "token" DROP CONSTRAINT "FK_d6f364e68fe0ddc4b826be7c27f"`, undefined);
        await queryRunner.query(`DROP TABLE "token"`, undefined);
    }

}
