import { Request, Response, NextFunction } from "express";

const asyncErrorHolder = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    fn(req, res, next).catch((err: any) => {
      console.error("Error caught by asyncErrorHolder:", err);

      res.status(500).json({
        message: err.message || "Something went wrong",
        fullError: err, // sends the complete error object
        stack: err.stack, // optional: shows where the error happened
      });
    });
  };
};

export default asyncErrorHolder;
