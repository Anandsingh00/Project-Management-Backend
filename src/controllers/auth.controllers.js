import { User } from "../models/user.models.js";
import { ApiResponse } from "../utils/api-response.js";
import { ApiError } from "../utils/api-errors.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { emailVerificationMailgenContent } from "../utils/mail.js";
import { sendMail } from "../utils/mail.js";

const generateAccessTokenAndRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = await user.generateAccessToken();
    const refreshToken = await user.generateRefreshToken();
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
    await user.generateTemporaryToken();

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

const loginUser = asyncHandler(async (req, res) => {
  console.log("Login controller called");
  const { username, email, password } = req.body;

  if (!email) {
    throw new ApiError(401, "Email is required");
  }

  const user = await User.findOne({ email });

  if (!user) {
    throw new ApiError(
      400,
      "User doesn't exist with this email.Please Register",
    );
  }

  const isPasswordValid = await user.comparePassword(password);

  if (!isPasswordValid) {
    throw new ApiError(400, "Password is incorrect");
  }

  const { accessToken, refreshToken } =
    await generateAccessTokenAndRefreshToken(user._id);

  console.log(
    `Recieved- Refresh Token: ${refreshToken} Access Token: ${accessToken}`,
  );

  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken -emailVeirficationToken -emailVerificationExpiry",
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken)
    .json(
      new ApiResponse(
        200,
        {
          user: loggedInUser,
          accessToken,
          refreshToken,
        },
        "user Login successfully",
      ),
    );
});

export { registerUser, loginUser };
