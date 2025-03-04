const User = function () {};
const TABLE = "users";
import knex from "knex";
import knexConfig from "../config/knexfile";
import { uploadFile } from "../services/uploadFile"; // นำเข้าฟังก์ชัน uploadFile
import { decryptAES256 } from "../utils/cryptoUtils"; // นำเข้าไฟล์ถอดรหัส
import { hashPassword } from "../utils/bcryptUtils"; // นำเข้าไฟล์แฮชรหัสผ่าน
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
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
        password: hashedPassword,
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

User.login = async (req: any, result: any) => {
  try {
    const { password } = req.headers;
    const { email } = req.body;

    if (!email || !password) {
      return result(null, {
        success: false,
        code: 400,
        message: "กรุณากรอกอีเมลและรหัสผ่าน",
        data: null,
      });
    }

    // ค้นหาผู้ใช้จากฐานข้อมูล
    const user = await db("users").where({ email }).first();
    if (!user) {
      return result(null, {
        success: false,
        code: 401,
        message: "ไม่สามารถเข้าสู่ระบบได้ เนื่องจากอีเมลหรือรหัสผ่านผิด",
        data: null,
      });
    }

    // ถอดรหัส AES-256 ของรหัสผ่านที่รับมา
    const decryptedPassword = decryptAES256(password);

    // ตรวจสอบรหัสผ่านกับ hash ที่เก็บในฐานข้อมูล
    const isMatch = await bcrypt.compare(decryptedPassword, user.password);
    if (!isMatch) {
      return result(null, {
        success: false,
        code: 401,
        message: "ไม่สามารถเข้าสู่ระบบได้ เนื่องจากอีเมลหรือรหัสผ่านผิด",
        data: null,
      });
    }

    // ดึงข้อมูลบริษัทที่ผู้ใช้มีสิทธิ์เข้าถึง
    const companies = await db("user_company as uc")
      .join("company as c", "uc.company_id", "=", "c.id")
      .where("uc.user_id", user.id)
      .select(
        "c.id",
        "c.name",
        "c.address",
        "c.sub_district",
        "c.district",
        "c.province",
        "c.postcode",
        "c.phone",
        "c.email",
        db.raw(`? || c.image_url as image_url`, [url]) // ✅ ใช้ `||` สำหรับ PostgreSQL
      );

    // สร้าง access token
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET_KEY!,
      { expiresIn: "24h" }
    );

    // ส่งข้อมูลกลับไปยัง client
    result(null, {
      success: true,
      code: 200,
      message: "ลงชื่อเข้าใช้สำเร็จ",
      data: {
        user: {
          ...(() => {
            const { password, created_at, updated_at, ...rest } = user; // 🔹 ลบ password
            return rest;
          })(),
          image_url: url + user.image_url,
        },
        companies,
        access_token: token,
      },
    });
  } catch (error: any) {
    result(error, {
      success: false,
      code: 500,
      message: "เกิดข้อผิดพลาดจากระบบ กรุณาลองใหม่อีกครั้ง",
      data: null,
    });
    throw new Error(error);
  }
};

User.forgotPassword = async (req: any, result: any) => {
  try {
    const { password } = req.headers;
    const { email } = req.body;

    result(null, true);
    // }
  } catch (error: any) {
    result(error, null);
    throw new Error(error);
  }
};

User.resetPassword = async (req: any, result: any) => {
  try {
    const { password } = req.headers;
    const { email } = req.body;

    result(null, true);
    // }
  } catch (error: any) {
    result(error, null);
    throw new Error(error);
  }
};

User.me = async (req: any, result: any) => {
  try {
    const { password } = req.headers;
    const { email } = req.body;

    result(null, true);
    // }
  } catch (error: any) {
    result(error, null);
    throw new Error(error);
  }
};

User.logout = async (req: any, result: any) => {
  try {
    const { password } = req.headers;
    const { email } = req.body;

    result(null, true);
    // }
  } catch (error: any) {
    result(error, null);
    throw new Error(error);
  }
};

export default User;
