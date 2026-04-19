import { ApiResponse } from "../utils/api-response.js";
import { asyncHandler } from "../utils/asyncHandler.js";
/**
  const healthCheck = (req, res) => {
  try {
    // console.log("health check controller hit");
    return res
      .status(200)
      .json(new ApiResponse(200, { mesage: `Server is running` }));
  } catch (error) {
    console.log(error);
  }
};
**/
// more modified version of the function

const healthCheck = asyncHandler(async (req, res) => {
  res.status(200).json(new ApiResponse(200, { message: "Server is running" }));
});

export default healthCheck;
