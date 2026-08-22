import express from "express";
import protect from "../middleware/authMiddleware.js";

import {
  updateSet,
  deleteSet,
} from "../controller/setController.js";

const router = express.Router();

router.put("/:id", protect, updateSet);
router.delete("/:id", protect, deleteSet);

export default router;