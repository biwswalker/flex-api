const Company = function () {};
const TABLE = "company";
import knex from "knex";
import knexConfig from "../config/knexfile";
import { uploadFile } from "../services/uploadFile"; // นำเข้าฟังก์ชัน uploadFile
const url = process.env.API_UPLOAD;
const db = knex(knexConfig.development);

// Model
Company.createCompany = async (req: any, result: any) => {
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
    const existingCompany = await db("company").where("name", name).first();
    if (existingCompany) {
      // ส่งข้อความ error กลับไปในรูปแบบ response
      return result(
        {
          status: false,
          message: "Company name already exists",
          data: [],
        },
        null
      );
    }

    const uploadfile = req.files.profile_image; // ตรวจสอบว่าไฟล์ถูกส่งมา

    // อัพโหลดไฟล์และได้ path ของไฟล์ที่อัพโหลด
    const imageUrl = await uploadFile(uploadfile, TABLE);

    // เพิ่มข้อมูลบริษัทใหม่
    const [newCompany] = await db("company")
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
    result(null, {
      success: true,
      code: 200,
      message: "ผู้ใช้ลงทะเบียนสำเร็จ",
      data: {
        ...newCompany,
        image_url: url + newCompany.image_url,
      },
    });
  } catch (error: any) {
    result(error, null);
    throw new Error(error);
  }
};

Company.getCompany = async (req: any, result: any) => {
  try {
    const { app_id } = req.headers;
    const { text_search } = req.query;
    const url = process.env.API_UPLOAD;

    let col = [
      "activity.activity_id",
      "activity.activity_name",
      "activity.activity_name_en",
      "activity.activity_detail_name",
      "activity.activity_detail_name_en",
      "activity.start_date",
      "activity.end_date",
      "activity.is_active",
      // knex.knex.raw(
      //   `date_format(activity.created_at, '%d-%m-%Y') as created_at`
      // ),
      // knex.knex.raw(`CONCAT('${url}',activity.image_path) as image_path`),
      // "activity.app_id",
    ];

    // let query = knex.knex
    //   .select(col)
    //   .from(TABLE)
    //   .where("activity.is_deleted", 0);

    // if (app_id) {
    //   query.where("activity.app_id", app_id);
    // }

    // if (req.body.page && req.body.size) {
    //   let page = 1;
    //   if (req.body.page) page = req.body.page;
    //   let size = 10;
    //   if (req.body.size) size = req.body.size;
    //   let page_start = (page - 1) * size;
    //   limit = "limit " + page_start + "," + size;
    //   query.offset(page_start).limit(size);
    // }

    // if (text_search) {
    //   query.where(function () {
    //     this.where(
    //       "activity.activity_name",
    //       "REGEXP",
    //       `${text_search}`
    //     ).orWhere("activity.activity_name_en", "REGEXP", `${text_search}`);
    //   });
    // }

    // let res = await query.then(function (result) {
    //   return result;
    // });

    // if (res.length == 0) {
    //   result("ไม่พบข้อมูล", null);
    // } else {
    //   const data = {
    //     data: res,
    //     // length: await getActivityTotal(req),
    //   };
    result(null, true);
    // }
  } catch (error: any) {
    result(error, null);
    throw new Error(error);
  }
};

Company.getCompanyById = async (req: any, result: any) => {
  try {
    const { id } = req.params;
    const company = await db("company").where("id", id).first();

    // หากไม่พบข้อมูลบริษัท
    if (!company) {
      return result(
        {
          success: false,
          code: 404,
          message: "ไม่พบข้อมูลบริษัทในระบบ",
          data: null,
        },
        null
      );
    }

    // ส่งข้อมูลบริษัทที่พบ
    return result(null, {
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
        data: null,
      },
      null
    );
    throw new Error(error);
  }
};

Company.updateCompanyById = async (req: any, result: any) => {
  try {
    const { app_id } = req.headers;
    const { text_search } = req.query;
    const url = process.env.API_UPLOAD;

    let col = [
      "activity.activity_id",
      "activity.activity_name",
      "activity.activity_name_en",
      "activity.activity_detail_name",
      "activity.activity_detail_name_en",
      "activity.start_date",
      "activity.end_date",
      "activity.is_active",
      // knex.knex.raw(
      //   `date_format(activity.created_at, '%d-%m-%Y') as created_at`
      // ),
      // knex.knex.raw(`CONCAT('${url}',activity.image_path) as image_path`),
      // "activity.app_id",
    ];

    // let query = knex.knex
    //   .select(col)
    //   .from(TABLE)
    //   .where("activity.is_deleted", 0);

    // if (app_id) {
    //   query.where("activity.app_id", app_id);
    // }

    // if (req.body.page && req.body.size) {
    //   let page = 1;
    //   if (req.body.page) page = req.body.page;
    //   let size = 10;
    //   if (req.body.size) size = req.body.size;
    //   let page_start = (page - 1) * size;
    //   limit = "limit " + page_start + "," + size;
    //   query.offset(page_start).limit(size);
    // }

    // if (text_search) {
    //   query.where(function () {
    //     this.where(
    //       "activity.activity_name",
    //       "REGEXP",
    //       `${text_search}`
    //     ).orWhere("activity.activity_name_en", "REGEXP", `${text_search}`);
    //   });
    // }

    // let res = await query.then(function (result) {
    //   return result;
    // });

    // if (res.length == 0) {
    //   result("ไม่พบข้อมูล", null);
    // } else {
    //   const data = {
    //     data: res,
    //     // length: await getActivityTotal(req),
    //   };
    result(null, true);
    // }
  } catch (error: any) {
    result(error, null);
    throw new Error(error);
  }
};

Company.deleteCompanyById = async (req: any, result: any) => {
  try {
    const { app_id } = req.headers;
    const { text_search } = req.query;
    const url = process.env.API_UPLOAD;

    let col = [
      "activity.activity_id",
      "activity.activity_name",
      "activity.activity_name_en",
      "activity.activity_detail_name",
      "activity.activity_detail_name_en",
      "activity.start_date",
      "activity.end_date",
      "activity.is_active",
      // knex.knex.raw(
      //   `date_format(activity.created_at, '%d-%m-%Y') as created_at`
      // ),
      // knex.knex.raw(`CONCAT('${url}',activity.image_path) as image_path`),
      // "activity.app_id",
    ];

    // let query = knex.knex
    //   .select(col)
    //   .from(TABLE)
    //   .where("activity.is_deleted", 0);

    // if (app_id) {
    //   query.where("activity.app_id", app_id);
    // }

    // if (req.body.page && req.body.size) {
    //   let page = 1;
    //   if (req.body.page) page = req.body.page;
    //   let size = 10;
    //   if (req.body.size) size = req.body.size;
    //   let page_start = (page - 1) * size;
    //   limit = "limit " + page_start + "," + size;
    //   query.offset(page_start).limit(size);
    // }

    // if (text_search) {
    //   query.where(function () {
    //     this.where(
    //       "activity.activity_name",
    //       "REGEXP",
    //       `${text_search}`
    //     ).orWhere("activity.activity_name_en", "REGEXP", `${text_search}`);
    //   });
    // }

    // let res = await query.then(function (result) {
    //   return result;
    // });

    // if (res.length == 0) {
    //   result("ไม่พบข้อมูล", null);
    // } else {
    //   const data = {
    //     data: res,
    //     // length: await getActivityTotal(req),
    //   };
    result(null, true);
    // }
  } catch (error: any) {
    result(error, null);
    throw new Error(error);
  }
};

export default Company;
