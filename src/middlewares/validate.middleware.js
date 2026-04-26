import { validationResult } from "express-validator";
import { ApiError } from "../utils/api-errors.js";

const validate = (req, res, next) => {
  console.log("inside validation middleware");
  const errors = validationResult(req);

  if (errors.isEmpty()) {
    return next();
  }

  const extractedErrors = [];

  errors.array().map((err) =>
    extractedErrors.push({
      [err.path]: err.msg,
    }),
  );
  extractedErrors.map((error) => {
    console.log(error);
  });

  throw new ApiError(422, "Recieved data is not valid", extractedErrors);
};

export { validate };
