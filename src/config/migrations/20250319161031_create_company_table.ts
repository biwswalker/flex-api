import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("company", (table) => {
    table.uuid("id").defaultTo(knex.raw("gen_random_uuid()")).primary(); // ใช้ gen_random_uuid() สำหรับ UUID
    table.string("name", 255).notNullable().unique(); // ชื่อบริษัท (จำเป็นต้องมี และห้ามซ้ำ)
    table.string("address", 255); // ที่อยู่บริษัท
    table.string("sub_district", 100); // ตำบล
    table.string("district", 100); // อำเภอ
    table.string("province", 100); // จังหวัด
    table.string("postcode", 10); // รหัสไปรษณีย์
    table.string("phone", 20); // เบอร์โทรศัพท์บริษัท
    table.string("email", 255); // อีเมลของบริษัท
    table.string("image_url", 500); // URL ของรูปบริษัท
    table.timestamp("created_at").defaultTo(knex.fn.now()).notNullable(); // วันที่สร้าง
    table.timestamp("updated_at").defaultTo(knex.fn.now()); // วันที่อัปเดตล่าสุด

    // เพิ่ม Index สำหรับคอลัมน์ที่ใช้ค้นหาบ่อย
    table.index(["name"], "idx_company_name"); // Index สำหรับชื่อบริษัท
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists("company");
}
