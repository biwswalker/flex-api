import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("otp", (table) => {
    table.uuid("id").defaultTo(knex.raw("gen_random_uuid()")).primary(); // Primary Key
    table.uuid("user_id").notNullable(); // Foreign Key อ้างอิงไปที่ users
    table.string("action", 255).notNullable(); // บอกว่า OTP ใช้ทำอะไร เช่น user_verify, reset_password
    table.string("ref", 10).unique().notNullable(); // สร้าง String+Number 6 ตัว และต้องไม่ซ้ำกัน
    table.string("otp", 6).notNullable(); // OTP เป็นตัวเลข 6 หลัก
    table.timestamp("created_at").defaultTo(knex.fn.now()).notNullable(); // เวลาสร้าง
    table.timestamp("updated_at").defaultTo(knex.fn.now()).notNullable(); // เวลาล่าสุดที่มีการเปลี่ยนแปลง

    // กำหนด Foreign Key Constraints
    table
      .foreign("user_id")
      .references("id")
      .inTable("users")
      .onDelete("CASCADE"); // ลบข้อมูลเมื่อผู้ใช้ถูกลบ

    // เพิ่ม Index สำหรับ user_id
    table.index(["user_id"], "idx_otp_user_id"); // Index สำหรับ user_id
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists("otp");
}
