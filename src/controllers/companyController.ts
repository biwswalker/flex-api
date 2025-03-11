import Company from "../models/Company";

// Controller
export const createCompany = (req: any, res: any) => {
  Company.createCompany(req, (err: any, data: any) => {
    if (err) {
      res.status(500).send(data); // ส่ง error response กลับไป
    } else {
      res.status(200).send(data); // ส่งข้อมูลที่สำเร็จกลับไป
    }
  });
};

export const getCompany = (req: any, res: any) => {
  Company.getCompany(req, (err: any, data: any) => {
    if (err) {
      res.status(500).send(data); // ส่ง error response กลับไป
    } else {
      res.status(200).send(data); // ส่งข้อมูลที่สำเร็จกลับไป
    }
  });
};

export const getCompanyById = (req: any, res: any) => {
  Company.getCompanyById(req, (err: any, data: any) => {
    if (err) {
      res.status(500).send(data); // ส่ง error response กลับไป
    } else {
      res.status(200).send(data); // ส่งข้อมูลที่สำเร็จกลับไป
    }
  });
};

export const updateCompanyById = (req: any, res: any) => {
  Company.updateCompanyById(req, (err: any, data: any) => {
    if (err) {
      res.status(500).send(data); // ส่ง error response กลับไป
    } else {
      res.status(200).send(data); // ส่งข้อมูลที่สำเร็จกลับไป
    }
  });
};

export const deleteCompanyById = (req: any, res: any) => {
  Company.deleteCompanyById(req, (err: any, data: any) => {
    if (err) {
      res.status(500).send(data); // ส่ง error response กลับไป
    } else {
      res.status(200).send(data); // ส่งข้อมูลที่สำเร็จกลับไป
    }
  });
};
