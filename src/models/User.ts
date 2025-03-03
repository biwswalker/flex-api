const User = function () {};
const TABLE = "users";
import knex from "knex";
import knexConfig from "../config/knexfile";
import { uploadFile } from "../services/uploadFile"; // นำเข้าฟังก์ชัน uploadFile
import { decryptAES256 } from "../utils/cryptoUtils"; // นำเข้าไฟล์ถอดรหัส
import { hashPassword } from "../utils/bcryptUtils"; // นำเข้าไฟล์แฮชรหัสผ่าน
const url = process.env.API_UPLOAD;

const db = knex(knexConfig.development);

User.createUser = async (req: any, result: any) => {
  try {
    const { name, password, email, role, company_id } = req.body;

    const uploadfile = req.files.profile_image; // ตรวจสอบว่าไฟล์ถูกส่งมา

    // อัพโหลดไฟล์และได้ path ของไฟล์ที่อัพโหลด
    const imageUrl = await uploadFile(uploadfile, TABLE);

    // // 🔹 ถอดรหัสรหัสผ่าน (AES-256)
    const decryptedPassword = decryptAES256(password);

    // // 🔹 แฮชรหัสผ่านก่อนบันทึกลง DB
    const hashedPassword = await hashPassword(decryptedPassword);

    // 🔹 บันทึกข้อมูลลงฐานข้อมูล
    const [newUser] = await db(TABLE)
      .insert({
        name,
        email,
        password : hashedPassword,
        role,
        image_url: imageUrl,
      })
      .returning("*");

    await db("user_company")
      .insert({
        user_id: newUser.id,
        company_id,
      })
      .returning("*");

    result(null, {
      success: true,
      code: 200,
      message: "ผู้ใช้ลงทะเบียนสำเร็จ",
      data: {
        ...(() => {
          const { password, ...rest } = newUser; // 🔹 ลบ password
          return rest;
        })(),
        image_url: url + newUser.image_url,
      },
    });
  } catch (error: any) {
    result(error, null);
    throw new Error(error);
  }
};

User.getUser = async (req: any, result: any) => {
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

User.getUserById = async (req: any, result: any) => {
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

User.updateUserById = async (req: any, result: any) => {
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

User.deleteUserById = async (req: any, result: any) => {
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
export default User;
