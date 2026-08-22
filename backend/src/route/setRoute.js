import express from "express";

import {
  updateSet,
  deleteSet,
} from "../controller/setController.js";

const router = express.Router();

router.put("/:id", updateSet);
router.delete("/:id", deleteSet);

export default router;