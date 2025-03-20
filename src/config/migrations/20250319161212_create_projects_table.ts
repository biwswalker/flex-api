import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("projects", (table) => {
    table.uuid("id").defaultTo(knex.raw("gen_random_uuid()")).primary(); // Primary Key
    table.uuid("company_id").notNullable(); // Foreign Key อ้างอิงไปที่ company
    table.string("name", 255).notNullable(); // ชื่อโครงการ
    table.string("description", 1000); // รายละเอียดโครงการ
    table.decimal("budget", 15, 2).notNullable(); // งบประมาณโครงการ
    table.string("status", 50).notNullable(); // สถานะโครงการ
    table.timestamp("created_at").defaultTo(knex.fn.now()).notNullable(); // วันที่สร้าง
    table.timestamp("updated_at").defaultTo(knex.fn.now()); // วันที่แก้ไขล่าสุด

    // กำหนด Foreign Key Constraints
    table
      .foreign("company_id")
      .references("id")
      .inTable("company")
      .onDelete("CASCADE"); // ลบข้อมูลเมื่อบริษัทถูกลบ

    // เพิ่ม Index สำหรับ company_id
    table.index(["company_id"], "idx_projects_company_id"); // Index สำหรับ company_id
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists("projects");
}
