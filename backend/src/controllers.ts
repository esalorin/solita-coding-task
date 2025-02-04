import { Request, Response } from "express";
import { fetchOverviewData, fetchDailyData } from "./services";

export const getOverviewData = async (req: Request, res: Response) => {
  try {
    const data = await fetchOverviewData();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch overview data" });
  }
}

export const getDailyData = async (req: Request, res: Response) => {
  try {
    const date = req.query.date as string;
    const timezone = req.query.timezone as string;
    console.log(date, timezone);
    const data = await fetchDailyData(date, timezone);
    res.json(data);
  } catch (error) {
    console.error("Error fetching daily data:", error);
    res.status(500).json({ error: "Failed to fetch daily data" });
  }
}
