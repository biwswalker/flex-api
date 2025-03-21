const Project = function () {};
const TABLE = "project";
import { uploadFile } from "../services/uploadFile"; // นำเข้าฟังก์ชัน uploadFile
import { dbConnection } from "@config/knex";
const url = process.env.API_UPLOAD;

// Model
Project.createProject = async (req: any, result: Result) => {
  const db = dbConnection();
  try {
    const { company_id, name, description, budget, status } = req.body;

    const [newProject] = await db(TABLE)
      .insert({
        company_id,
        name,
        description,
        budget,
        status,
      })
      .returning("*");

    // ส่งข้อมูลโปรเจคที่ถูกเพิ่มไปยัง Controller
    return result({
      success: true,
      code: 200,
      message: "สร้างโปรเจคสำเร็จ",
      data: {
        ...newProject,
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

Project.getProject = async (req: any, result: Result) => {
  const db = dbConnection();
  try {
    const { text_search, page = 1, size = 10 } = req.query;

    let query = db(TABLE).select(
      "id",
      "company_id",
      "name",
      "description",
      "budget",
      "status",
      db.raw(`? || image_url as image_url`, [url]), // ✅ ใช้ `||` สำหรับ PostgreSQL
      "created_at",
      "updated_at"
    );

    if (text_search) {
      query.where(function () {
        this.where("name", "like", `%${text_search}%`).orWhere(
          "description",
          "like",
          `%${text_search}%`
        );
      });
    }

    const page_start = (page - 1) * size;
    query.offset(page_start).limit(size);

    const projects = await query;

    if (projects.length === 0) {
      return result({
        success: false,
        code: 404,
        message: "ไม่พบข้อมูลโปรเจค",
        data: null,
      });
    }

    return result({
      success: true,
      code: 200,
      message: "ค้นหาโปรเจคสำเร็จ",
      data: projects,
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

Project.getProjectById = async (req: any, result: Result) => {
  const db = dbConnection();
  try {
    const { id } = req.params;
    const project = await db(TABLE).where("id", id).first();

    // หากไม่พบข้อมูลโปรเจค
    if (!project) {
      return result(
        {
          success: false,
          code: 404,
          message: "ไม่พบข้อมูลโปรเจคในระบบ",
          data: null,
        },
        true
      );
    }

    // ส่งข้อมูลโปรเจคที่พบ
    return result({
      success: true,
      code: 200,
      message: "ค้นหาโปรเจคสำเร็จ",
      data: {
        ...project,
        image_url: url + project.image_url,
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

Project.updateProjectById = async (req: any, result: Result) => {
  const db = dbConnection();
  try {
    const { id } = req.params;
    const { company_id, name, description, budget, status } = req.body;

    const uploadfile = req.files?.profile_image;

    let imageUrl;
    if (uploadfile) {
      imageUrl = await uploadFile(uploadfile, TABLE);
    }

    const [updatedProject] = await db(TABLE)
      .where("id", id)
      .update({
        company_id,
        name,
        description,
        budget,
        status,
        ...(imageUrl && { image_url: imageUrl }),
      })
      .returning("*");

    if (!updatedProject) {
      return result({
        success: false,
        code: 404,
        message: "ไม่พบข้อมูลโปรเจค",
        data: null,
      });
    }

    return result({
      success: true,
      code: 200,
      message: "อัพเดทข้อมูลโปรเจคสำเร็จ",
      data: {
        ...updatedProject,
        image_url: url + updatedProject.image_url,
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

Project.deleteProjectById = async (req: any, result: Result) => {
  const db = dbConnection();
  try {
    const { id } = req.params;

    const [deletedProject] = await db(TABLE)
      .where("id", id)
      .del()
      .returning("*");

    if (!deletedProject) {
      return result({
        success: false,
        code: 404,
        message: "ไม่พบข้อมูลโปรเจค",
        data: null,
      });
    }

    return result({
      success: true,
      code: 200,
      message: "ลบข้อมูลโปรเจคสำเร็จ",
      data: deletedProject,
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

export default Project;
