import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateProductTable1709719968741 implements MigrationInterface {
    name = 'CreateProductTable1709719968741'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "products" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(100) NOT NULL, "price" numeric(10,2) NOT NULL DEFAULT '0', "description" text NOT NULL, "image" character varying NOT NULL DEFAULT '/uploads/example.jpeg', "category" character varying(20) NOT NULL, "company" character varying(20) NOT NULL, "colors" text NOT NULL DEFAULT '["#222"]', "featured" boolean NOT NULL DEFAULT false, "free_shipping" boolean NOT NULL DEFAULT false, "inventory_number" character varying NOT NULL, "average_rating" numeric(5,2) NOT NULL DEFAULT '0', "num_of_reviews" integer NOT NULL DEFAULT '0', "userId" integer, CONSTRAINT "PK_0806c755e0aca124e67c0cf6d7d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "products" ADD CONSTRAINT "FK_99d90c2a483d79f3b627fb1d5e9" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "products" DROP CONSTRAINT "FK_99d90c2a483d79f3b627fb1d5e9"`);
        await queryRunner.query(`DROP TABLE "products"`);
    }

}
