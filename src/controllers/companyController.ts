import Company from "../models/Company";

// Controller
export const createCompany = (req: any, res: any) => {
  Company.createCompany(req, (data, error) => {
    if(error) {
      // Boolean for error handlering
    }
    return res.status(data.code).send(data); // ส่งข้อมูลที่สำเร็จกลับไป
  });
};

export const getCompany = (req: any, res: any) => {
  Company.getCompany(req, (data, error) => {
    if(error) {
      // Boolean for error handlering
    }
    return res.status(data.code).send(data); // ส่งข้อมูลที่สำเร็จกลับไป
  });
};

export const getCompanyById = (req: any, res: any) => {
  Company.getCompanyById(req, (data, error) => {
    if(error) {
      // Boolean for error handlering
    }
    return res.status(data.code).send(data); // ส่งข้อมูลที่สำเร็จกลับไป
  });
};

export const updateCompanyById = (req: any, res: any) => {
  Company.updateCompanyById(req, (data, error) => {
    if(error) {
      // Boolean for error handlering
    }
    return res.status(data.code).send(data); // ส่งข้อมูลที่สำเร็จกลับไป
  });
};

export const deleteCompanyById = (req: any, res: any) => {
  Company.deleteCompanyById(req, (data, error) => {
    if(error) {
      // Boolean for error handlering
    }
    return res.status(data.code).send(data); // ส่งข้อมูลที่สำเร็จกลับไป
  });
};
