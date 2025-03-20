import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("user_company", (table) => {
    table.uuid("id").defaultTo(knex.raw("gen_random_uuid()")).primary(); // ใช้ gen_random_uuid() สำหรับ UUID
    table.uuid("user_id").notNullable(); // Foreign Key อ้างอิงไปที่ users
    table.uuid("company_id").notNullable(); // Foreign Key อ้างอิงไปที่ company

    // กำหนด Foreign Key Constraints
    table
      .foreign("user_id")
      .references("id")
      .inTable("users")
      .onDelete("CASCADE"); // ลบข้อมูลเมื่อผู้ใช้ถูกลบ
    table
      .foreign("company_id")
      .references("id")
      .inTable("company")
      .onDelete("CASCADE"); // ลบข้อมูลเมื่อบริษัทถูกลบ

    // เพิ่ม Index สำหรับ user_id และ company_id
    table.index(["user_id"], "idx_user_company_user_id"); // Index สำหรับ user_id
    table.index(["company_id"], "idx_user_company_company_id"); // Index สำหรับ company_id
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists("user_company");
}
