import { Request, Response } from "express";
import { ClassType } from "../database/models/classTypeModel";
import { successResponse } from "../utils/successResponse";
import { errorResponse } from "../utils/errorResponse";

export const create = async (req: Request, res: Response) => {
  const { name } = req.body;

  const existing = await ClassType.findOne({
    name: new RegExp(`^${name}$`, "i"),
  });

  if (existing) {
    return res.status(409).json(
      errorResponse({
        title: "Conflict",
        message: "Class type already exists",
        errors: [
          {
            field: "name",
            message: "A class type with this name already exists",
          },
        ],
      }),
    );
  }

  const classType = await ClassType.create(req.body);

  res.status(201).json(
    successResponse({
      title: "Class type created",
      message: "Class type added successfully",
      data: classType,
    }),
  );
};

export const getById = async (req: Request, res: Response) => {
  const classType = await ClassType.findById(req.params.id);

  if (!classType) {
    return res.status(404).json(
      errorResponse({
        title: "Not Found",
        message: "Class type not found",
        errors: [{ field: "id", message: "Class type does not exist" }],
      }),
    );
  }

  res.json(
    successResponse({
      title: "Class type fetched",
      message: "Class type loaded",
      data: classType,
    }),
  );
};

export const update = async (req: Request, res: Response) => {
  const classType = await ClassType.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });

  if (!classType) {
    return res.status(404).json(
      errorResponse({
        title: "Not Found",
        message: "Class type not found",
        errors: [{ field: "id", message: "Class type does not exist" }],
      }),
    );
  }

  res.json(
    successResponse({
      title: "Class type updated",
      message: "Class type updated successfully",
      data: classType,
    }),
  );
};

export const getAll = async (req: Request, res: Response) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const [data, total] = await Promise.all([
    ClassType.find().skip(skip).limit(limit).sort({ createdAt: -1 }),
    ClassType.countDocuments(),
  ]);

  res.json(
    successResponse({
      title: "Class types fetched",
      message: "Class type list loaded",
      data,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    }),
  );
};

export const remove = async (req: Request, res: Response) => {
  const classType = await ClassType.findByIdAndDelete(req.params.id);

  if (!classType) {
    return res.status(404).json(
      errorResponse({
        title: "Not Found",
        message: "Class type not found",
        errors: [{ field: "id", message: "Class type does not exist" }],
      }),
    );
  }

  res.json(
    successResponse({
      title: "Class type deleted",
      message: "Class type removed successfully",
      data: {},
    }),
  );
};
