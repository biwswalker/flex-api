import User from "../models/User";

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
