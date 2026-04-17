import { ApiResponse } from "../utils/api-response.js";
const healthCheck = (req, res) => {
  try {
    console.log("health check controller hit");
    return res
      .status(200)
      .json(new ApiResponse(200, { mesage: `Server is running` }));
  } catch (error) {
    console.log(error);
  }
};

export default healthCheck;
