import express from "express";
import { addMoney, getTransactionHistory, removeMoney} from "../controllers/walletController.js"; // Update imports for ES Modules

const router = express.Router();

// Add money to wallet
router.post("/add-money", addMoney);
router.post("/remove-money", removeMoney);

// Get transaction history
router.get("/history/:userId", getTransactionHistory);

export default router; // Use ES Modules syntax for export
