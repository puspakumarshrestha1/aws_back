import { comparePassword, hashPassword } from "../helpers/authHelper.js";
import userModel from "../model/userModel.js";
import orderModel from "../model/orderModel.js";
import JWT from "jsonwebtoken";

export const registerController = async (req, res) => {
  try {
    const { name, email, password, phone, address, answer } = req.body;

    //validations
    if (!name) {
      return res.send({ message: "Name is Required" });
    }
    if (!email) {
      return res.send({ message: "Email is Required" });
    }
    if (!password) {
      return res.send({ message: "Password is Required" });
    }
    if (!phone) {
      return res.send({ message: "Phone no is Required" });
    }
    if (!address) {
      return res.send({ message: "Address is Required" });
    }
    if (!answer) {
      return res.send({ message: "answer is Required" });
    }

    //check user
    const exisitingUser = await userModel.findOne({ email });

    //exisiting user
    if (exisitingUser) {
      return res.status(200).send({
        success: false,
        message: "Already Registered please login",
      });
    }

    //register user
    const hashedpassword = await hashPassword(password);

    //save
    const user = await new userModel({
      name,
      email,
      phone,
      address,
      answer,
      password: hashedpassword,
      answer,
    }).save();

    res.status(201).send({
      success: true,
      message: "User Register Successfully",
      user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in Registeration",
      error,
    });
  }
};

//POST LOGIN
export const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;
    //validation
    if (!email || !password) {
      return res.status(404).send({
        success: false,
        message: "invalid email or password",
      });
    }
    //check
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "email is not registered",
      });
    }
    const match = await comparePassword(password, user.password);
    if (!match) {
      return res.status(200).send({
        success: false,
        message: "invalid password",
      });
    }
    //token
    const token = await JWT.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    res.status(200).send({
      success: true,
      message: "login sucessfully",
      user: {
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "error in login",
      error,
    });
  }
};

//forgetpassword
export const forgetPasswordController = async (req, res) => {
  try {
    const { email, answer, newpassword } = req.body; // Destructure the request body

    if (!email) {
      return res.status(400).send({ message: "Email is required" });
    }
    if (!answer) {
      return res.status(400).send({ message: "Answer is required" });
    }
    if (!newpassword) {
      return res.status(400).send({ message: "New Password is required" });
    }
    // Check if user exists with the provided email and answer
    const user = await userModel.findOne({ email, answer });

    // If no user is found, return a 404 error
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "Wrong email or answer",
      });
    }

    // Hash the new password
    const hashedPassword = await hashPassword(newpassword);

    // Update user's password in the database
    await userModel.findByIdAndUpdate(user._id, { password: hashedPassword });

    // Send a success response
    res.status(200).send({
      success: true,
      message: "Password reset successfully",
    });
  } catch (error) {
    // If an error occurs, log it and send a 500 Internal Server Error response
    console.error(error);
    res.status(500).send({
      success: false,
      message: "Something went wrong",
      error: error.message, // Include the error message in the response
    });
  }
};

//test controller
export const testController = (req, res) => {
  try {
    res.send("protected route");
  } catch (error) {
    console.log(error);
    res.send({ error });
  }
};

//update prfole
export const updateProfileController = async (req, res) => {
  try {
    const { name, email, password, address, phone } = req.body;
    const user = await userModel.findById(req.user._id);
    //password
    if (password && password.length < 6) {
      return res.json({ error: "Passsword is required and 6 character long" });
    }
    const hashedPassword = password ? await hashPassword(password) : undefined;
    const updatedUser = await userModel.findByIdAndUpdate(
      req.user._id,
      {
        name: name || user.name,
        password: hashedPassword || user.password,
        phone: phone || user.phone,
        address: address || user.address,
      },
      { new: true }
    );
    res.status(200).send({
      success: true,
      message: "Profile Updated SUccessfully",
      updatedUser,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "Error WHile Update profile",
      error,
    });
  }
};

//orders
export const getOrdersController = async (req, res) => {
  try {
    const orders = await orderModel
      .find({ buyer: req.user._id })
      .populate("products", "-photo")
      .populate("buyer", "name");
    res.json(orders);
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error WHile Geting Orders",
      error,
    });
  }
};
//orders
export const getAllOrdersController = async (req, res) => {
  try {
    const orders = await orderModel
      .find({})
      .populate("products", "-photo")
      .populate("buyer", "name")
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error WHile Geting Orders",
      error,
    });
  }
};

//order status
export const orderStatusController = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;
    const orders = await orderModel.findByIdAndUpdate(
      orderId,
      { status },
      { new: true }
    );
    res.json(orders);
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error While Updateing Order",
      error,
    });
  }
};
