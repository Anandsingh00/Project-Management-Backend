import { User } from "../models/user.models.js";
import { ApiResponse } from "../utils/api-response.js";
import { ApiError } from "../utils/api-errors.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { emailVerificationMailgenContent } from "../utils/mail.js";
import { sendMail } from "../utils/mail.js";

const generateAccessTokenAndRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });
    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      "Something went wrong while generating access token and refresh Token",
    );
  }
};

const registerUser = asyncHandler(async (req, res) => {
  console.log("register controller called");
  const { email, username, password, role } = req.body;

  const isUserExist = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (isUserExist) {
    throw new ApiError(409, "User already exist with this email.Please Login");
  }

  const user = await User.create({
    username,
    email,
    password,
    isEmailVerified: false,
  });

  const { unHashedToken, hashedToken, tokenExpiry } =
    user.generateTemporaryToken();

  user.emailVeirficationToken = unHashedToken;
  user.emailVerificationExpiry = tokenExpiry;

  await user.save({ validateBeforeSave: false });

  await sendMail({
    email: user?.email,
    subject: "Please verify your email",
    mailgenContent: emailVerificationMailgenContent(
      user.username,
      `${req.protocol}://${req.get("host")}/api/v1/users/verify-email/${unHashedToken}`,
    ),
  });
  //.find dont want password refreshToken  emailVeirficationToken emailVerificationExpiry

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken -emailVeirficationToken -emailVerificationExpiry",
  );

  if (!createdUser) {
    throw new ApiError(505, "Something went wrong while registering the user");
  }

  res
    .status(201)
    .json(
      new ApiResponse(
        200,
        { createdUser },
        "User created succesfully and verification email has been sent on your email",
      ),
    );
});

export { registerUser };
