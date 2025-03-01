import User from "../models/User";

export const createUser = (req: any, res: any) => {
  User.createUser(req, (err: any, data: any) => {
    if (err) {
      res.status(200).send({
        status: false,
        data: [],
        msg: err.toString(),
      });
    } else {
      res.status(200).send({
        status: true,
        data: data.data,
        length: data.length,
      });
    }
  });
};

export const getUser = (req: any, res: any) => {
  User.getUser(req, (err: any, data: any) => {
    if (err) {
      res.status(200).send({
        status: false,
        data: [],
        msg: err.toString(),
      });
    } else {
      res.status(200).send({
        status: true,
        data: data.data,
        length: data.length,
      });
    }
  });
};

export const getUserById = (req: any, res: any) => {
  User.getUserById(req, (err: any, data: any) => {
    if (err) {
      res.status(200).send({
        status: false,
        data: [],
        msg: err.toString(),
      });
    } else {
      res.status(200).send({
        status: true,
        data: data.data,
        length: data.length,
      });
    }
  });
};

export const updateUserById = (req: any, res: any) => {
  User.updateUserById(req, (err: any, data: any) => {
    if (err) {
      res.status(200).send({
        status: false,
        data: [],
        msg: err.toString(),
      });
    } else {
      res.status(200).send({
        status: true,
        data: data.data,
        length: data.length,
      });
    }
  });
};

export const deleteUserById = (req: any, res: any) => {
  User.deleteUserById(req, (err: any, data: any) => {
    if (err) {
      res.status(200).send({
        status: false,
        data: [],
        msg: err.toString(),
      });
    } else {
      res.status(200).send({
        status: true,
        data: data.data,
        length: data.length,
      });
    }
  });
};
