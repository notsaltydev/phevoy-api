import {MigrationInterface, QueryRunner} from "typeorm";

export class ScheduleAndConferenceInitialMigration1587061389403 implements MigrationInterface {
    name = 'ScheduleAndConferenceInitialMigration1587061389403'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "schedule" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "date" TIMESTAMP NOT NULL DEFAULT now(), "createdOn" TIMESTAMP NOT NULL DEFAULT now(), "updatedOn" TIMESTAMP NOT NULL DEFAULT now(), "ownerId" uuid, CONSTRAINT "PK_1c05e42aec7371641193e180046" PRIMARY KEY ("id"))`, undefined);
        await queryRunner.query(`CREATE TABLE "conference" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "description" text, "startDate" TIMESTAMP NOT NULL DEFAULT now(), "endDate" TIMESTAMP NOT NULL DEFAULT now(), "createdOn" TIMESTAMP NOT NULL DEFAULT now(), "updatedOn" TIMESTAMP NOT NULL DEFAULT now(), "ownerId" uuid, "scheduleId" uuid, CONSTRAINT "PK_e203a214f53b0eeefb3db00fdb2" PRIMARY KEY ("id"))`, undefined);
        await queryRunner.query(`ALTER TABLE "schedule" ADD CONSTRAINT "FK_e22e9649ffb18c6a8ee535163e3" FOREIGN KEY ("ownerId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
        await queryRunner.query(`ALTER TABLE "conference" ADD CONSTRAINT "FK_6e1c7e76e6b28550cae617ca6a8" FOREIGN KEY ("ownerId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
        await queryRunner.query(`ALTER TABLE "conference" ADD CONSTRAINT "FK_899cde128a040462b0a9a5d7845" FOREIGN KEY ("scheduleId") REFERENCES "schedule"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "conference" DROP CONSTRAINT "FK_899cde128a040462b0a9a5d7845"`, undefined);
        await queryRunner.query(`ALTER TABLE "conference" DROP CONSTRAINT "FK_6e1c7e76e6b28550cae617ca6a8"`, undefined);
        await queryRunner.query(`ALTER TABLE "schedule" DROP CONSTRAINT "FK_e22e9649ffb18c6a8ee535163e3"`, undefined);
        await queryRunner.query(`DROP TABLE "conference"`, undefined);
        await queryRunner.query(`DROP TABLE "schedule"`, undefined);
    }

}
