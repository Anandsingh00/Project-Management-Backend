import { User } from "../models/user.models.js";
import { ApiError } from "../utils/api-errors.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";

const verifyJWT = asyncHandler(async (req, res, next) => {
  const token =
    req.cookies?.accessToken ||
    req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    throw new ApiError(401, "Unauthorized request");
  }

  try {
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    const user = await User.findById(decodedToken._id).select(
      "-password -refreshToken -emailVerificationToken -emailVerificationExpiry",
    );

    if (!user) {
      throw new ApiError(401, "Unauthorized request");
    }

    req.user = user;
    next();
  } catch (error) {
    console.log(`Error in auth middleware: ${error.message}`);
    return new ApiError(501, "Something went wrong in auth middleware");
  }
});

export { verifyJWT };
