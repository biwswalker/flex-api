import Project from "../models/Project";

// Controller
export const createProject = (req: any, res: any) => {
  Project.createProject(req, (err: any, data: any) => {
    if (err) {
      res.status(500).send(data); // ส่ง error response กลับไป
    } else {
      res.status(200).send(data); // ส่งข้อมูลที่สำเร็จกลับไป
    }
  });
};

export const getProject = (req: any, res: any) => {
  Project.getProject(req, (err: any, data: any) => {
    if (err) {
      res.status(500).send(data); // ส่ง error response กลับไป
    } else {
      res.status(200).send(data); // ส่งข้อมูลที่สำเร็จกลับไป
    }
  });
};

export const getProjectById = (req: any, res: any) => {
  Project.getProjectById(req, (err: any, data: any) => {
    if (err) {
      res.status(500).send(data); // ส่ง error response กลับไป
    } else {
      res.status(200).send(data); // ส่งข้อมูลที่สำเร็จกลับไป
    }
  });
};

export const updateProjectById = (req: any, res: any) => {
  Project.updateProjectById(req, (err: any, data: any) => {
    if (err) {
      res.status(500).send(data); // ส่ง error response กลับไป
    } else {
      res.status(200).send(data); // ส่งข้อมูลที่สำเร็จกลับไป
    }
  });
};

export const deleteProjectById = (req: any, res: any) => {
  Project.deleteProjectById(req, (err: any, data: any) => {
    if (err) {
      res.status(500).send(data); // ส่ง error response กลับไป
    } else {
      res.status(200).send(data); // ส่งข้อมูลที่สำเร็จกลับไป
    }
  });
};
