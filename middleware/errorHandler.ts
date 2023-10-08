import { Request, Response, NextFunction } from "express";
import CustomErrorType from "../interface/CustomError.interface";

const errorHandler = (
  err: CustomErrorType,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err.code) {
    return res.status(err.code).json({ success: false, msg: err.message });
  }

  return res.json({ success: false, msg: err.message });
};

export default errorHandler;
