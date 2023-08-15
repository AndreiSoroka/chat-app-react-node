import express from "express";
import * as pingController from "../controllers/pingController.mjs";

const router = express.Router();

router.get("/ping", pingController.ping);

export default router;
