import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("transaction", (table) => {
    table.uuid("id").defaultTo(knex.raw("gen_random_uuid()")).primary(); // Primary Key
    table.uuid("company_id").notNullable(); // Foreign Key อ้างอิงไปที่ company
    table.uuid("project_id"); // Foreign Key อ้างอิงไปที่ project
    table.uuid("account_id").notNullable(); // Foreign Key อ้างอิงไปที่ account
    table.decimal("amount", 18, 2).notNullable(); // จำนวนเงิน
    table.string("type", 255).notNullable(); // ประเภท (รายรับ/รายจ่าย)
    table.string("description", 255); // คำอธิบายเกี่ยวกับธุรกรรม
    table.timestamp("transaction_date").defaultTo(knex.fn.now()).notNullable(); // วันที่ของธุรกรรม
    table.timestamp("created_at").defaultTo(knex.fn.now()).notNullable(); // เวลาสร้าง
    table.timestamp("updated_at").defaultTo(knex.fn.now()).notNullable(); // เวลาล่าสุดที่มีการเปลี่ยนแปลง

    // กำหนด Foreign Key Constraints
    table
      .foreign("company_id")
      .references("id")
      .inTable("company")
      .onDelete("CASCADE"); // ลบข้อมูลเมื่อบริษัทถูกลบ
    table
      .foreign("project_id")
      .references("id")
      .inTable("projects")
      .onDelete("CASCADE"); // ลบข้อมูลเมื่อโปรเจคถูกลบ
    table
      .foreign("account_id")
      .references("id")
      .inTable("accounts")
      .onDelete("CASCADE"); // ลบข้อมูลเมื่อบัญชีถูกลบ

    // เพิ่ม Index สำหรับ company_id, project_id, และ account_id
    table.index(["company_id"], "idx_transaction_company_id"); // Index สำหรับ company_id
    table.index(["project_id"], "idx_transaction_project_id"); // Index สำหรับ project_id
    table.index(["account_id"], "idx_transaction_account_id"); // Index สำหรับ account_id
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists("transaction");
}