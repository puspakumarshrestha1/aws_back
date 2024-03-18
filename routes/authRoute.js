import express from "express";
import { isAdmin, requireSignIn } from "../middlewares/authMiddleware.js";
import {
  forgetPasswordController,
  getAllOrdersController,
  getOrdersController,
  loginController,
  orderStatusController,
  registerController,
  testController,
  updateProfileController,
} from "../controllers/authController.js";
//router object
const router = express.Router();

router.post("/register", registerController);

//LOGN
router.post("/login", loginController);

//test router
router.get("/test", requireSignIn, isAdmin, testController);

//forget password
router.post("/forget-password", forgetPasswordController);

//protected routes
router.get("/user-auth", requireSignIn, (req, res) => {
  res.status(200).send({ ok: true });
});

router.get('/is-admin', isAdmin, (req, res) => {
  // If middleware isAdmin passes, the user is an admin
  res.status(200).json({ isAdmin: true });
});

//admin
router.get("/admin-auth", requireSignIn, isAdmin, (req, res) => {
  res.status(200).send({ ok: true });
});

//update profile
router.put("/profile", requireSignIn, updateProfileController);
export default router;

//orders
router.get("/orders", requireSignIn, getOrdersController);

//all orders
router.get("/all-orders", requireSignIn, isAdmin, getAllOrdersController);

// order status update
router.put(
  "/order-status/:orderId",
  requireSignIn,
  isAdmin,
  orderStatusController
);
