import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("accounts", (table) => {
    table.uuid("id").defaultTo(knex.raw("gen_random_uuid()")).primary(); // Primary Key
    table.uuid("company_id").notNullable(); // Foreign Key อ้างอิงไปที่ company
    table.string("bank", 100).notNullable(); // ชื่อธนาคาร
    table.string("bank_name", 255).notNullable(); // ชื่อธนาคาร
    table.string("bank_number", 50).notNullable(); // เลขบัญชี
    table.string("bank_branch", 100); // สาขาธนาคาร
    table.decimal("balance", 18, 2).notNullable(); // ยอดเงินในบัญชี
    table.timestamp("created_at").defaultTo(knex.fn.now()).notNullable(); // เวลาสร้าง
    table.timestamp("updated_at").defaultTo(knex.fn.now()).notNullable(); // เวลาล่าสุดที่มีการเปลี่ยนแปลง

    // กำหนด Foreign Key Constraints
    table
      .foreign("company_id")
      .references("id")
      .inTable("company")
      .onDelete("CASCADE"); // ลบข้อมูลเมื่อบริษัทถูกลบ

    // เพิ่ม Index สำหรับ company_id
    table.index(["company_id"], "idx_accounts_company_id"); // Index สำหรับ company_id
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists("accounts");
}