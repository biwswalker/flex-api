const Account = function () {};
const TABLE = "accounts";
import { dbConnection } from "@config/knex";

Account.createAccount = async (req: any, result: Result) => {
  const db = dbConnection();
  try {
    const { company_id, bank, bank_name, bank_number, bank_branch, role } =
      req.body;

    if (role !== "OWNER" && role !== "ADMIN") {
      return result({
        success: false,
        code: 403,
        message: "คุณไม่มีสิทธิ์ในการเพิ่มบัญชีธนาคาร",
        data: null,
      });
    }

    // ตรวจสอบหมายเลขบัญชีว่ามีอยู่ในระบบหรือไม่
    const existingAccount = await db(TABLE)
      .where("bank_number", bank_number)
      .first();
    if (existingAccount) {
      return result({
        success: false,
        code: 400,
        message:
          "ไม่สามารถสร้างบัญชีธนาคารได้ เนื่องจากหมายเลขบัญชีถูกใช้ไปแล้ว",
        data: null,
      });
    }

    // เพิ่มข้อมูลบัญชีใหม่
    const [newAccount] = await db(TABLE)
      .insert({
        company_id,
        bank,
        bank_name,
        bank_number,
        bank_branch,
      })
      .returning("*");

    return result({
      success: true,
      code: 200,
      message: "เพิ่มบัญชีสำเร็จ",
      data: newAccount,
    });
  } catch (error: any) {
    return result({
      success: false,
      code: 500,
      message: "เกิดข้อผิดพลาดจากระบบ กรุณาลองใหม่อีกครั้ง",
      data: error.message,
    });
  }
};

Account.getAccount = async (req: any, result: Result) => {
  const db = dbConnection();
  try {
    const { company_id, page = 1, size = 10 } = req.query;

    let query = db(TABLE).select(
      "id",
      "company_id",
      "bank",
      "bank_name",
      "bank_number",
      "bank_branch",
      "created_at",
      "updated_at"
    );

    if (company_id) {
      query.where("company_id", company_id);
    }

    const page_start = (page - 1) * size;
    query.offset(page_start).limit(size);

    const accounts = await query;

    if (accounts.length === 0) {
      return result({
        success: false,
        code: 404,
        message: "ไม่พบข้อมูลบัญชีธนาคาร",
        data: null,
      });
    }

    return result({
      success: true,
      code: 200,
      message: "ค้นหาบัญชีสำเร็จ",
      data: accounts,
    });
  } catch (error: any) {
    return result({
      success: false,
      code: 500,
      message: "เกิดข้อผิดพลาดจากระบบ กรุณาลองใหม่อีกครั้ง",
      data: error.message,
    });
  }
};

Account.getAccountById = async (req: any, result: Result) => {
  const db = dbConnection();
  try {
    const { id } = req.params;

    const account = await db(TABLE).where("id", id).first();

    if (!account) {
      return result({
        success: false,
        code: 404,
        message: "ไม่พบข้อมูลบัญชีธนาคาร",
        data: null,
      });
    }

    return result({
      success: true,
      code: 200,
      message: "ค้นหาบัญชีสำเร็จ",
      data: account,
    });
  } catch (error: any) {
    return result({
      success: false,
      code: 500,
      message: "เกิดข้อผิดพลาดจากระบบ กรุณาลองใหม่อีกครั้ง",
      data: error.message,
    });
  }
};

Account.updateAccountById = async (req: any, result: Result) => {
  const db = dbConnection();
  try {
    const { id } = req.params;
    const { bank, bank_name, bank_number, bank_branch } = req.body;

    // ตรวจสอบ Role
    const { role } = req.user;
    if (role !== "OWNER" && role !== "ADMIN") {
      return result({
        success: false,
        code: 403,
        message: "คุณไม่มีสิทธิ์ในการแก้ไขบัญชีธนาคาร",
        data: null,
      });
    }

    // ตรวจสอบหมายเลขบัญชีว่ามีอยู่ในระบบหรือไม่
    const existingAccount = await db(TABLE)
      .where("bank_number", bank_number)
      .andWhereNot("id", id)
      .first();
    if (existingAccount) {
      return result({
        success: false,
        code: 400,
        message:
          "ไม่สามารถแก้ไขบัญชีธนาคารได้ เนื่องจากหมายเลขบัญชีถูกใช้ไปแล้ว",
        data: null,
      });
    }

    const [updatedAccount] = await db(TABLE)
      .where("id", id)
      .update({
        bank,
        bank_name,
        bank_number,
        bank_branch,
      })
      .returning("*");

    if (!updatedAccount) {
      return result({
        success: false,
        code: 404,
        message: "ไม่พบข้อมูลบัญชีธนาคาร",
        data: null,
      });
    }

    return result({
      success: true,
      code: 200,
      message: "แก้ไขบัญชีสำเร็จ",
      data: updatedAccount,
    });
  } catch (error: any) {
    return result({
      success: false,
      code: 500,
      message: "เกิดข้อผิดพลาดจากระบบ กรุณาลองใหม่อีกครั้ง",
      data: error.message,
    });
  }
};

Account.deleteAccountById = async (req: any, result: Result) => {
  const db = dbConnection();
  try {
    const { id } = req.params;

    // ตรวจสอบ Role
    const { role } = req.user;
    if (role !== "OWNER" && role !== "ADMIN") {
      return result({
        success: false,
        code: 403,
        message: "คุณไม่มีสิทธิ์ในการลบบัญชีธนาคาร",
        data: null,
      });
    }

    const [deletedAccount] = await db(TABLE)
      .where("id", id)
      .del()
      .returning("*");

    if (!deletedAccount) {
      return result({
        success: false,
        code: 404,
        message: "ไม่พบข้อมูลบัญชีธนาคาร",
        data: null,
      });
    }

    return result({
      success: true,
      code: 200,
      message: "ลบบัญชีสำเร็จ",
      data: deletedAccount,
    });
  } catch (error: any) {
    return result({
      success: false,
      code: 500,
      message: "เกิดข้อผิดพลาดจากระบบ กรุณาลองใหม่อีกครั้ง",
      data: error.message,
    });
  }
};

export default Account;
