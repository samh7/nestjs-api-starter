import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1742666376672 implements MigrationInterface {
    name = 'Migration1742666376672'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`users\` DROP FOREIGN KEY \`FK_3dcbd55983fcd698c9134c2f24b\``);
        await queryRunner.query(`DROP INDEX \`IDX_232b9597ff9a89b2c2fc5d1b5e\` ON \`users\``);
        await queryRunner.query(`DROP INDEX \`IDX_9760615d88ed518196bb79ea03\` ON \`users\``);
        await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`first_name\``);
        await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`middle_name\``);
        await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`last_name\``);
        await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`age\``);
        await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`tribe\``);
        await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`national_id\``);
        await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`employee_id\``);
        await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`date_of_start\``);
        await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`building\``);
        await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`department\``);
        await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`gender\``);
        await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`job_title\``);
        await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`job_description\``);
        await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`employment_type\``);
        await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`retirement_date\``);
        await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`supervisorId\``);
        await queryRunner.query(`ALTER TABLE \`base_entity\` CHANGE \`deletedAt\` \`deletedAt\` datetime(6) NULL`);
        await queryRunner.query(`ALTER TABLE \`users\` CHANGE \`deletedAt\` \`deletedAt\` datetime(6) NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`users\` CHANGE \`deletedAt\` \`deletedAt\` datetime(6) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`base_entity\` CHANGE \`deletedAt\` \`deletedAt\` datetime(6) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`users\` ADD \`supervisorId\` varchar(36) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`users\` ADD \`retirement_date\` timestamp NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`users\` ADD \`employment_type\` enum ('0', '1') NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`users\` ADD \`job_description\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`users\` ADD \`job_title\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`users\` ADD \`gender\` enum ('0', '1') NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`users\` ADD \`department\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`users\` ADD \`building\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`users\` ADD \`date_of_start\` date NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`users\` ADD \`employee_id\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`users\` ADD \`national_id\` int NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`users\` ADD \`tribe\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`users\` ADD \`age\` int NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`users\` ADD \`last_name\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`users\` ADD \`middle_name\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`users\` ADD \`first_name\` varchar(255) NOT NULL`);
        await queryRunner.query(`CREATE UNIQUE INDEX \`IDX_9760615d88ed518196bb79ea03\` ON \`users\` (\`employee_id\`)`);
        await queryRunner.query(`CREATE UNIQUE INDEX \`IDX_232b9597ff9a89b2c2fc5d1b5e\` ON \`users\` (\`national_id\`)`);
        await queryRunner.query(`ALTER TABLE \`users\` ADD CONSTRAINT \`FK_3dcbd55983fcd698c9134c2f24b\` FOREIGN KEY (\`supervisorId\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
