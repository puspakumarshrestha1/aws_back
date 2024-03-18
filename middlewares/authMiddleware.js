import JWT from "jsonwebtoken";
import userModel from "../model/userModel.js";

//Protected routes token base
export const requireSignIn = async (req, res, next) => {
  try {
    const decode = JWT.verify(
      req.headers.authorization,
      process.env.JWT_SECRET
    );
    req.user = decode;
    next();
  } catch (error) {
    console.log(error);
  }
};

//admin access
export const isAdmin = async (req, res, next) => {
  try {
    const userId = req.user._id;
    // Log user ID for debugging
    console.log("User ID:", userId);

    const user = await userModel.findById(userId);
    // Log user object for debugging
    console.log("User:", user);

    if (!user) {
      return res.status(404).send({
        success: false,
        message: "User not found",
      });
    }

    if (user.role === 1) {
      // User is already an admin, proceed to the next middleware
      next();
    } else {
      // Update user's role to admin (assuming role 1 represents admin)
      user.role = 1; // Assign admin role
      await user.save(); // Save the updated user document
      next(); // Proceed to the next middleware
    }
  } catch (error) {
    console.error("Error in isAdmin middleware:", error);
    res.status(500).send({
      success: false,
      error,
      message: "Error occurred while processing the request",
    });
  }
};
