import Account from "../models/Account";

// Controller
export const createAccount = (req: any, res: any) => {
  Account.createAccount(req, (data, error) => {
    if(error) {
      // Boolean for error handlering
    }
    return res.status(data.code).send(data); // ส่งข้อมูลที่สำเร็จกลับไป
  });
};

export const getAccount = (req: any, res: any) => {
  Account.getAccount(req, (data, error) => {
    if(error) {
      // Boolean for error handlering
    }
    return res.status(data.code).send(data); // ส่งข้อมูลที่สำเร็จกลับไป
  });
};

export const getAccountById = (req: any, res: any) => {
  Account.getAccountById(req, (data, error) => {
    if(error) {
      // Boolean for error handlering
    }
    return res.status(data.code).send(data); // ส่งข้อมูลที่สำเร็จกลับไป
  });
};

export const updateAccountById = (req: any, res: any) => {
  Account.updateAccountById(req, (data, error) => {
    if(error) {
      // Boolean for error handlering
    }
    return res.status(data.code).send(data); // ส่งข้อมูลที่สำเร็จกลับไป
  });
};

export const deleteAccountById = (req: any, res: any) => {
  Account.deleteAccountById(req, (data, error) => {
    if(error) {
      // Boolean for error handlering
    }
    return res.status(data.code).send(data); // ส่งข้อมูลที่สำเร็จกลับไป
  });
};
