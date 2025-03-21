const Company = function () {};
const TABLE = "company";
import { uploadFile } from "../services/uploadFile"; // นำเข้าฟังก์ชัน uploadFile
import { dbConnection } from "@config/knex";
const url = process.env.API_UPLOAD;

// Model
Company.createCompany = async (req: any, result: Result) => {
  const db = dbConnection();
  try {
    const {
      name,
      address,
      sub_district,
      district,
      province,
      postcode,
      phone,
      email,
    } = req.body;

    // ตรวจสอบชื่อบริษัทว่ามีอยู่ในระบบหรือไม่
    const existingCompany = await db(TABLE).where("name", name).first();
    if (existingCompany) {
      // ส่งข้อความ error กลับไปในรูปแบบ response
      return result(
        {
          success: false,
          code: 400,
          message: "Company name already exists",
          data: [],
        },
        true
      );
    }

    const uploadfile = req.files.profile_image; // ตรวจสอบว่าไฟล์ถูกส่งมา

    // อัพโหลดไฟล์และได้ path ของไฟล์ที่อัพโหลด
    const imageUrl = await uploadFile(uploadfile, TABLE);

    // เพิ่มข้อมูลบริษัทใหม่
    const [newCompany] = await db(TABLE)
      .insert({
        name,
        address,
        sub_district,
        district,
        province,
        postcode,
        phone,
        email,
        image_url: imageUrl, // URL ของภาพ
      })
      .returning("*");

    // ส่งข้อมูลบริษัทที่ถูกเพิ่มไปยัง Controller
    return result({
      success: true,
      code: 200,
      message: "ผู้ใช้ลงทะเบียนสำเร็จ",
      data: {
        ...newCompany,
        image_url: url + newCompany.image_url,
      },
    });
  } catch (error: any) {
    return result(
      {
        success: false,
        code: 500,
        message: "เกิดข้อผิดพลาดจากระบบ กรุณาลองใหม่อีกครั้ง",
        data: error.message,
      },
      true
    );
  }
};

Company.getCompany = async (req: any, result: Result) => {
  const db = dbConnection();
  try {
    const { text_search, page = 1, size = 10 } = req.query;

    let query = db("company").select(
      "id",
      "name",
      "address",
      "sub_district",
      "district",
      "province",
      "postcode",
      "phone",
      "email",
      db.raw(`? || image_url as image_url`, [url]), // ✅ ใช้ `||` สำหรับ PostgreSQL
      "created_at",
      "updated_at"
    );

    if (text_search) {
      query.where(function () {
        this.where("name", "like", `%${text_search}%`)
          .orWhere("address", "like", `%${text_search}%`)
          .orWhere("sub_district", "like", `%${text_search}%`)
          .orWhere("district", "like", `%${text_search}%`)
          .orWhere("province", "like", `%${text_search}%`)
          .orWhere("postcode", "like", `%${text_search}%`)
          .orWhere("phone", "like", `%${text_search}%`)
          .orWhere("email", "like", `%${text_search}%`);
      });
    }

    const page_start = (page - 1) * size;
    query.offset(page_start).limit(size);

    const companies = await query;

    if (companies.length === 0) {
      return result({
        success: false,
        code: 404,
        message: "ไม่พบข้อมูลบริษัท",
        data: null,
      });
    }

    return result({
      success: true,
      code: 200,
      message: "ค้นหาบริษัทสำเร็จ",
      data: companies,
    });
  } catch (error: any) {
    result(
      {
        success: false,
        code: 500,
        message: "เกิดข้อผิดพลาดจากระบบ กรุณาลองใหม่อีกครั้ง",
        data: error.message,
      },
      true
    );
  }
};

Company.getCompanyById = async (req: any, result: Result) => {
  const db = dbConnection();
  try {
    const { id } = req.params;
    const company = await db(TABLE).where("id", id).first();

    // หากไม่พบข้อมูลบริษัท
    if (!company) {
      return result(
        {
          success: false,
          code: 404,
          message: "ไม่พบข้อมูลบริษัทในระบบ",
          data: null,
        },
        true
      );
    }

    // ส่งข้อมูลบริษัทที่พบ
    return result({
      success: true,
      code: 200,
      message: "ค้นหาบริษัทสำเร็จ",
      data: {
        ...company,
        image_url: url + company.image_url,
      },
    });
  } catch (error: any) {
    return result(
      {
        success: false,
        code: 500,
        message: "เกิดข้อผิดพลาดจากระบบ กรุณาลองใหม่อีกครั้ง",
        data: error.message,
      },
      true
    );
  }
};

Company.updateCompanyById = async (req: any, result: Result) => {
  const db = dbConnection();
  try {
    const { id } = req.params;
    const {
      name,
      address,
      sub_district,
      district,
      province,
      postcode,
      phone,
      email,
    } = req.body;

    const uploadfile = req.files?.profile_image;

    let imageUrl;
    if (uploadfile) {
      imageUrl = await uploadFile(uploadfile, TABLE);
    }

    const [updatedCompany] = await db(TABLE)
      .where("id", id)
      .update({
        name,
        address,
        sub_district,
        district,
        province,
        postcode,
        phone,
        email,
        ...(imageUrl && { image_url: imageUrl }),
      })
      .returning("*");

    if (!updatedCompany) {
      return result({
        success: false,
        code: 404,
        message: "ไม่พบข้อมูลบริษัท",
        data: null,
      });
    }

    return result({
      success: true,
      code: 200,
      message: "อัพเดทข้อมูลบริษัทสำเร็จ",
      data: {
        ...updatedCompany,
        image_url: url + updatedCompany.image_url,
      },
    });
  } catch (error: any) {
    result(
      {
        success: false,
        code: 500,
        message: "เกิดข้อผิดพลาดจากระบบ กรุณาลองใหม่อีกครั้ง",
        data: error.message,
      },
      true
    );
  }
};

Company.deleteCompanyById = async (req: any, result: Result) => {
  const db = dbConnection();
  try {
    const { id } = req.params;

    const [deletedCompany] = await db(TABLE)
      .where("id", id)
      .del()
      .returning("*");

    if (!deletedCompany) {
      return result({
        success: false,
        code: 404,
        message: "ไม่พบข้อมูลบริษัท",
        data: null,
      });
    }

    return result({
      success: true,
      code: 200,
      message: "ลบข้อมูลบริษัทสำเร็จ",
      data: deletedCompany,
    });
  } catch (error: any) {
    return result(
      {
        success: false,
        code: 500,
        message: "เกิดข้อผิดพลาดจากระบบ กรุณาลองใหม่อีกครั้ง",
        data: error.message,
      },
      true
    );
  }
};

export default Company;
