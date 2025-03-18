import Project from "../models/Project";

// Controller
export const createProject = (req: any, res: any) => {
  Project.createProject(req, (data, error) => {
    if(error) {
      // Boolean for error handlering
    }
    return res.status(data.code).send(data); // ส่งข้อมูลที่สำเร็จกลับไป
  });
};

export const getProject = (req: any, res: any) => {
  Project.getProject(req, (data, error) => {
    if(error) {
      // Boolean for error handlering
    }
    return res.status(data.code).send(data); // ส่งข้อมูลที่สำเร็จกลับไป
  });
};

export const getProjectById = (req: any, res: any) => {
  Project.getProjectById(req, (data, error) => {
    if(error) {
      // Boolean for error handlering
    }
    return res.status(data.code).send(data); // ส่งข้อมูลที่สำเร็จกลับไป
  });
};

export const updateProjectById = (req: any, res: any) => {
  Project.updateProjectById(req, (data, error) => {
    if(error) {
      // Boolean for error handlering
    }
    return res.status(data.code).send(data); // ส่งข้อมูลที่สำเร็จกลับไป
  });
};

export const deleteProjectById = (req: any, res: any) => {
  Project.deleteProjectById(req, (data, error) => {
    if(error) {
      // Boolean for error handlering
    }
    return res.status(data.code).send(data); // ส่งข้อมูลที่สำเร็จกลับไป
  });
};
