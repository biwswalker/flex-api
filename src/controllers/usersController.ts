import User from "../models/User";

export const createUser = (req: any, res: any) => {
  User.createUser(req, (data, error) => {
    if(error) {
      // Boolean for error handlering
    }
    return res.status(data.code).send(data); // ส่งข้อมูลที่สำเร็จกลับไป
  });
};

export const getUser = (req: any, res: any) => {
  User.getUser(req, (data, error) => {
    if(error) {
      // Boolean for error handlering
    }
    return res.status(data.code).send(data); // ส่งข้อมูลที่สำเร็จกลับไป
  });
};

export const getUserById = (req: any, res: any) => {
  User.getUserById(req, (data, error) => {
    if(error) {
      // Boolean for error handlering
    }
    return res.status(data.code).send(data); // ส่งข้อมูลที่สำเร็จกลับไป
  });
};

export const updateUserById = (req: any, res: any) => {
  User.updateUserById(req, (data, error) => {
    if(error) {
      // Boolean for error handlering
    }
    return res.status(data.code).send(data); // ส่งข้อมูลที่สำเร็จกลับไป
  });
};

export const deleteUserById = (req: any, res: any) => {
  User.deleteUserById(req, (data, error) => {
    if(error) {
      // Boolean for error handlering
    }
    return res.status(data.code).send(data); // ส่งข้อมูลที่สำเร็จกลับไป
  });
};

export const login = (req: any, res: any) => {
  User.login(req, (data, error) => {
    if(error) {
      // Boolean for error handlering
    }
    return res.status(data.code).send(data); // ส่งข้อมูลที่สำเร็จกลับไป
  });
};

export const forgotPassword = (req: any, res: any) => {
  User.forgotPassword(req, (data, error) => {
    if(error) {
      // Boolean for error handlering
    }
    return res.status(data.code).send(data); // ส่งข้อมูลที่สำเร็จกลับไป
  });
};

export const verify = (req: any, res: any) => {
  User.verify(req, (data, error) => {
    if(error) {
      // Boolean for error handlering
    }
    return res.status(data.code).send(data); // ส่งข้อมูลที่สำเร็จกลับไป
  });
};

export const resetPassword = (req: any, res: any) => {
  User.resetPassword(req, (data, error) => {
    if(error) {
      // Boolean for error handlering
    }
    return res.status(data.code).send(data); // ส่งข้อมูลที่สำเร็จกลับไป
  });
};

export const me = (req: any, res: any) => {
  User.me(req, (data, error) => {
    if(error) {
      // Boolean for error handlering
    }
    return res.status(data.code).send(data); // ส่งข้อมูลที่สำเร็จกลับไป
  });
};

export const logout = (req: any, res: any) => {
  User.logout(req, (data, error) => {
    if(error) {
      // Boolean for error handlering
    }
    return res.status(data.code).send(data); // ส่งข้อมูลที่สำเร็จกลับไป
  });
};
