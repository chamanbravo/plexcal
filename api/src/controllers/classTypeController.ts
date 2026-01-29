import { Request, Response } from "express";

export const getClassTypes = async (req: Request, res: Response) => {
  return res.json({
    message: "test",
  });
};
