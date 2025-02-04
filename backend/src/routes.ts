import express from "express";
import { getOverviewData, getDailyData } from "./controllers";

const router = express.Router();

router.get("/overview", getOverviewData);
router.get("/dailyview", getDailyData);

export default router;
