import * as reportService from '../services/reportService.js';
import { getTodayDateString } from '../utils/dateUtils.js';

export const getDaily = async (req, res, next) => {
  try {
    const date = req.query.date || getTodayDateString();
    const report = await reportService.getDailyReport(req.user.id, date);

    res.status(200).json({
      success: true,
      data: report,
    });
  } catch (error) {
    next(error);
  }
};

export const getMonthToDate = async (req, res, next) => {
  try {
    const date = req.query.date || getTodayDateString();
    const report = await reportService.getMonthToDateReport(req.user.id, date);

    res.status(200).json({
      success: true,
      data: report,
    });
  } catch (error) {
    next(error);
  }
};

export const getMonthly = async (req, res, next) => {
  try {
    const date = req.query.date || getTodayDateString();
    const report = await reportService.getMonthlyReport(req.user.id, date);

    res.status(200).json({
      success: true,
      data: report,
    });
  } catch (error) {
    next(error);
  }
};
