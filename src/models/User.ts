const User = function () {};
const TABLE = "users";
import { dbConnection, dbTransaction } from "@config/knex";
import { uploadFile } from "../services/uploadFile"; // นำเข้าฟังก์ชัน uploadFile
import { decryption } from "../utils/cryptoUtils"; // นำเข้าไฟล์ถอดรหัส
import { hashPassword } from "../utils/bcryptUtils"; // นำเข้าไฟล์แฮชรหัสผ่าน
import { generateAccessToken } from "../utils/jwtUtils"; // นำเข้าไฟล์แฮชรหัสผ่าน
import bcrypt from "bcrypt";
import nodemailer from "nodemailer";
import crypto from "crypto";
const url = process.env.API_UPLOAD;

User.createUser = async (req: any, result: Result) => {
  const { database, transaction } = await dbTransaction();
  try {
    const { name, password, email, role, company_id } = req.body;

    const uploadfile = req.files.profile_image; // ตรวจสอบว่าไฟล์ถูกส่งมา

    // อัพโหลดไฟล์และได้ path ของไฟล์ที่อัพโหลด
    const imageUrl = await uploadFile(uploadfile, TABLE);

    // // 🔹 ถอดรหัสรหัสผ่าน (AES-256)
    const decryptedPassword = decryption(password);

    // // 🔹 แฮชรหัสผ่านก่อนบันทึกลง DB
    const hashedPassword = await hashPassword(decryptedPassword);

    // 🔹 บันทึกข้อมูลลงฐานข้อมูล
    const [newUser] = await transaction(TABLE)
      .insert({
        name,
        email,
        password: hashedPassword,
        role,
        image_url: imageUrl,
      })
      .returning("*");

    await transaction("user_company")
      .insert({
        user_id: newUser.id,
        company_id,
      })
      .returning("*");

    transaction.commit(); // ***ต้องใส่เสมอหากใช้ transaction
    result({
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
    transaction.rollback(error); // ***ต้องใส่เสมอหากใช้ transaction เพื่อคืนค่ากลับตามเดิม
    return result(
      {
        success: false,
        code: 500,
        message: "เกิดข้อผิดพลาดจากระบบ กรุณาลองใหม่อีกครั้ง",
        data: error.message,
      },
      true
    );
  } finally {
    database.destroy();
  }
};

User.getUser = async (req: any, result: Result) => {
  const db = dbConnection();
  try {
    const { email, role, company_ids, name } = req.query;

    // ตรวจสอบสิทธิ์การเข้าถึง API
    if (!["OWNER", "ADMIN"].includes(role)) {
      return result({
        success: false,
        code: 403,
        message: "ท่านไม่มีสิทธิการเข้าถึง",
        data: null,
      });
    }

    // สร้าง query พื้นฐาน
    let query = db("users").select(
      "users.id as user_id",
      "users.name",
      "users.email",
      "users.role",
      db.raw(`? || users.image_url as image_url`, [url]), // ✅ ใช้ `||` สำหรับ PostgreSQL
      "users.created_at",
      "users.updated_at"
    );

    // กรองข้อมูลตาม request params
    let companies = JSON.parse(company_ids);
    if (companies && Array.isArray(companies)) {
      query.whereExists(function () {
        this.select("user_company.user_id")
          .from("user_company")
          .whereRaw("user_company.user_id = users.id")
          .whereIn("user_company.company_id", companies);
      });
    }

    // ดึงข้อมูลจากฐานข้อมูล
    const users = await query;

    return result({
      success: true,
      code: 200,
      message: "รายการผู้ใช้สำเร็จ",
      data: users,
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

User.getUserById = async (req: any, result: Result) => {
  const db = dbConnection();
  try {
    const { id } = req.params;

    // ดึงข้อมูลผู้ใช้จากฐานข้อมูล
    const user = await db("users")
      .select(
        "id",
        "name",
        "email",
        "role",
        db.raw(`? || image_url as image_url`, [url]), // ✅ ใช้ `||` สำหรับ PostgreSQL
        "created_at",
        "updated_at"
      )
      .where("id", id)
      .first();

    if (!user) {
      return result({
        success: false,
        code: 404,
        message: "ไม่พบผู้ใช้",
        data: null,
      });
    }

    // ดึงข้อมูลบริษัทที่เกี่ยวข้อง
    const companies = await db("user_company as uc")
      .join("company as c", "uc.company_id", "c.id")
      .where("uc.user_id", id)
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

    return result({
      success: true,
      code: 200,
      message: "ดึงข้อมูลผู้ใช้สำเร็จ",
      data: { user, companies },
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

User.updateUserById = async (req: any, result: Result) => {
  const db = dbConnection();
  try {
    const { id } = req.params;
    const { name, email, role, company_id } = req.body;

    // อัพเดทข้อมูลผู้ใช้ในฐานข้อมูล
    const [updatedUser] = await db("users")
      .where("id", id)
      .update({
        name,
        email,
        role,
      })
      .returning("*");

    if (!updatedUser) {
      return result({
        success: false,
        code: 404,
        message: "ไม่พบผู้ใช้",
        data: null,
      });
    }

    // อัพเดทข้อมูลบริษัทที่เกี่ยวข้อง
    await db("user_company").where("user_id", id).update({
      company_id,
    });

    return result({
      success: true,
      code: 200,
      message: "อัพเดทข้อมูลผู้ใช้สำเร็จ",
      data: updatedUser,
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

User.deleteUserById = async (req: any, result: Result) => {
  const db = dbConnection();
  try {
    const { id } = req.params;

    // ลบข้อมูลผู้ใช้จากฐานข้อมูล
    const deletedUser = await db("users").where("id", id).del().returning("*");

    if (!deletedUser) {
      return result({
        success: false,
        code: 404,
        message: "ไม่พบผู้ใช้",
        data: null,
      });
    }

    // ลบข้อมูลบริษัทที่เกี่ยวข้อง
    await db("user_company").where("user_id", id).del();

    return result({
      success: true,
      code: 200,
      message: "ลบข้อมูลผู้ใช้สำเร็จ",
      data: deletedUser,
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

User.login = async (req: any, result: Result) => {
  const database = dbConnection();
  try {
    const { password } = req.headers;
    const { email } = req.body;

    if (!email || !password) {
      return result(
        {
          success: false,
          code: 400,
          message: "กรุณากรอกอีเมลและรหัสผ่าน",
          data: null,
        },
        true
      );
    }

    // ค้นหาผู้ใช้จากฐานข้อมูล
    const user = await database("users").where({ email }).first();
    if (!user) {
      return result(
        {
          success: false,
          code: 401,
          message: "ไม่สามารถเข้าสู่ระบบได้ เนื่องจากอีเมลหรือรหัสผ่านผิด",
          data: null,
        },
        true
      );
    }

    // ถอดรหัส AES-256 ของรหัสผ่านที่รับมา
    const decryptedPassword = decryption(password);

    // ตรวจสอบรหัสผ่านกับ hash ที่เก็บในฐานข้อมูล
    const isMatch = await bcrypt.compare(decryptedPassword, user.password);
    if (!isMatch) {
      return result(
        {
          success: false,
          code: 401,
          message: "ไม่สามารถเข้าสู่ระบบได้ เนื่องจากอีเมลหรือรหัสผ่านผิด",
          data: null,
        },
        true
      );
    }

    // ดึงข้อมูลบริษัทที่ผู้ใช้มีสิทธิ์เข้าถึง
    const companies = await database("user_company as uc")
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
        database.raw(`? || c.image_url as image_url`, [url]) // ✅ ใช้ `||` สำหรับ PostgreSQL
      );

    // สร้าง access token
    const token = generateAccessToken(
      { id: user.id, email: user.email, role: user.role },
      { expiresIn: "24h" }
    );

    // ส่งข้อมูลกลับไปยัง client
    result({
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
    return result(
      {
        success: false,
        code: 500,
        message: "เกิดข้อผิดพลาดจากระบบ กรุณาลองใหม่อีกครั้ง",
        data: error.message,
      },
      true
    );
  } finally {
    database.destroy();
  }
};

User.forgotPassword = async (req: any, result: Result) => {
  const db = dbConnection();
  try {
    const { email } = req.body;

    // ค้นหาผู้ใช้จากฐานข้อมูล
    const user = await db("users").where({ email }).first();
    if (!user) {
      return result({
        success: false,
        code: 404,
        message: "ไม่พบอีเมลนี้ในระบบ",
        data: null,
      });
    }

    // สร้าง OTP
    const otp = crypto.randomInt(100000, 999999).toString();

    // สร้าง reference string
    const ref = crypto.randomBytes(3).toString("hex");

    // เก็บ OTP ในฐานข้อมูลชั่วคราว
    await db("otp").insert({
      user_id: user.id,
      action: "reset_password",
      ref,
      otp,
    });

    // ตั้งค่า nodemailer
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // ตั้งค่าอีเมล
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Reset Password OTP",
      text: `กรุณาใช้ OTP นี้เพื่อเปลี่ยนรหัสผ่านของท่าน: ${otp}\nReference: ${ref}`,
    };

    // ส่งอีเมล
    await transporter.sendMail(mailOptions);

    return result({
      success: true,
      code: 200,
      message: "OTP สำหรับเปลี่ยนรหัสผ่านถูกส่งไปยังอีเมลของท่าน",
      data: null,
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

User.resetPassword = async (req: any, result: Result) => {
  const db = dbConnection();
  try {
    const { email, otp, ref, password } = req.body;

    // ค้นหาผู้ใช้จากฐานข้อมูล
    const user = await db("users").where({ email }).first();
    if (!user) {
      return result({
        success: false,
        code: 404,
        message: "ไม่พบอีเมลนี้ในระบบ",
        data: null,
      });
    }

    // ค้นหา OTP จากฐานข้อมูล
    const otpRecord = await db("otp")
      .where({ user_id: user.id, otp, ref, action: "reset_password" })
      .first();

    if (!otpRecord) {
      return result({
        success: false,
        code: 400,
        message: "OTP หรือ Reference ไม่ถูกต้อง",
        data: null,
      });
    }

    // ถอดรหัสรหัสผ่านใหม่ (AES-256)
    const decryptedPassword = decryption(password);

    // แฮชรหัสผ่านใหม่
    const hashedPassword = await hashPassword(decryptedPassword);

    // อัพเดทรหัสผ่านในฐานข้อมูล
    await db("users")
      .where({ id: user.id })
      .update({ password: hashedPassword });

    // ลบ OTP หลังจากใช้งาน
    // await db("otp").where({ id: otpRecord.id }).del();

    return result({
      success: true,
      code: 200,
      message: "เปลี่ยนรหัสผ่านสำเร็จ",
      data: null,
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

User.verify = async (req: any, result: Result) => {
  const db = dbConnection();
  try {
    const { email, otp, ref } = req.body;

    // ค้นหาผู้ใช้จากฐานข้อมูล
    const user = await db("users").where({ email }).first();
    if (!user) {
      return result({
        success: false,
        code: 404,
        message: "ไม่พบอีเมลนี้ในระบบ",
        data: null,
      });
    }

    // ค้นหา OTP จากฐานข้อมูล
    const otpRecord = await db("otp")
      .where({ user_id: user.id, otp, ref, action: "user_verify" })
      .first();

    if (!otpRecord) {
      return result({
        success: false,
        code: 400,
        message: "OTP หรือ Reference ไม่ถูกต้อง",
        data: null,
      });
    }

    // ลบ OTP หลังจากใช้งาน
    // await db("otp").where({ id: otpRecord.id }).del();

    return result({
      success: true,
      code: 200,
      message: "ยืนยัน OTP สำเร็จ",
      data: null,
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

User.me = async (req: any, result: Result) => {
  const db = dbConnection();
  try {
    const { id } = req.body;
    // ✅ ดึงข้อมูลผู้ใช้จากฐานข้อมูล
    const user = await db("users")
      .select(
        "id",
        "name",
        "email",
        "role",
        db.raw(`? || image_url as image_url`, [url]), // ✅ ใช้ `||` สำหรับ PostgreSQL
        "created_at",
        "updated_at"
      )
      .where("id", id)
      .first();

    if (!user) {
      return result({
        success: false,
        code: 400,
        message: "ไม่สามารถดูข้อมูลผู้ใช้ในระบบได้ เนื่องจากเกิดข้อผิดพลาด",
        data: null,
      });
    }

    // ✅ ดึงข้อมูลบริษัทที่เกี่ยวข้อง
    const companies = await db("user_company as uc")
      .join("company as c", "uc.company_id", "c.id")
      .where("uc.user_id", id)
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
        "created_at",
        "updated_at",
        db.raw(`? || c.image_url as image_url`, [url]) // ✅ ใช้ `||` สำหรับ PostgreSQL
      );

    // ✅ ส่งข้อมูลกลับ
    return result({
      success: true,
      code: 200,
      message: "รายการผู้ใช้สำเร็จ",
      data: { user, companies },
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

User.logout = async (req: any, result: Result) => {
  try {
    const { password } = req.headers;
    const { email } = req.body;

    return result(
      {
        success: true,
        code: 200,
        message: "ออกจากระบบสำเร็จ",
        data: null,
      },
      true
    );
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

export default User;
