import express from "express";
import {
  categoryControlller,
  createCategoryController,
  deleteCategoryController,
  singleCategoryController,
  updateCategoryController,
} from "./../controllers/categoryController.js";
import { isAdmin, requireSignIn } from "./../middlewares/authMiddleware.js";
const router = express.Router();
//routes

//create category
router.post(
  "/create-category",
  requireSignIn,
  isAdmin,
  createCategoryController
);

//update
router.put(
  "/update-category/:id",
  requireSignIn,
  isAdmin,
  updateCategoryController
);

//getAll category

router.get("/getall-category", categoryControlller);

//single cat
router.get("/single-category/:slug", singleCategoryController);

//delete
router.delete(
  "/delete-category/:id",
  requireSignIn,
  isAdmin,
  deleteCategoryController
);

export default router;
