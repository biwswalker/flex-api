import User from "../models/User";

export const createUser = (req: any, res: any) => {
  User.createUser(req, (err: any, data: any) => {
    if (err) {
      res.status(500).send(err); // ส่ง error response กลับไป
    } else {
      res.status(200).send(data); // ส่งข้อมูลที่สำเร็จกลับไป
    }
  });
};

export const getUser = (req: any, res: any) => {
  User.getUser(req, (err: any, data: any) => {
    if (err) {
      res.status(500).send(err); // ส่ง error response กลับไป
    } else {
      res.status(200).send(data); // ส่งข้อมูลที่สำเร็จกลับไป
    }
  });
};

export const getUserById = (req: any, res: any) => {
  User.getUserById(req, (err: any, data: any) => {
    if (err) {
      res.status(500).send(err); // ส่ง error response กลับไป
    } else {
      res.status(200).send(data); // ส่งข้อมูลที่สำเร็จกลับไป
    }
  });
};

export const updateUserById = (req: any, res: any) => {
  User.updateUserById(req, (err: any, data: any) => {
    if (err) {
      res.status(500).send(err); // ส่ง error response กลับไป
    } else {
      res.status(200).send(data); // ส่งข้อมูลที่สำเร็จกลับไป
    }
  });
};

export const deleteUserById = (req: any, res: any) => {
  User.deleteUserById(req, (err: any, data: any) => {
    if (err) {
      res.status(500).send(err); // ส่ง error response กลับไป
    } else {
      res.status(200).send(data); // ส่งข้อมูลที่สำเร็จกลับไป
    }
  });
};
