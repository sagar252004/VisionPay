import express from "express";
import { login, logout, register} from "../controllers/user.controller.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";
// import { singleUpload } from "../middlewares/multer.js";

const router = express.Router();

router.route("/register").post(register);
router.route("/login").post(login);
router.route("/logout").get(logout);
// router.route("/add-money").post(add-money);
// router.route("/history/:userId").get(history);


export default router;