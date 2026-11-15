import * as readingService from '../services/readingService.js';
import { validateReadingInput } from '../validators/readingValidator.js';
import { ApiError } from '../utils/errors.js';
import { ERROR_CODES } from '../utils/constants.js';

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const validateReadingId = (id) => {
  if (!id || typeof id !== 'string' || !UUID_REGEX.test(id)) {
    throw new ApiError(400, 'Invalid reading ID format.', ERROR_CODES.VALIDATION_ERROR);
  }
};

export const create = async (req, res, next) => {
  try {
    const validatedData = validateReadingInput(req.body);
    const reading = await readingService.createReading(req.user.id, validatedData);

    res.status(201).json({
      success: true,
      message: 'Reading created successfully.',
      data: reading,
    });
  } catch (error) {
    next(error);
  }
};

export const list = async (req, res, next) => {
  try {
    const { date } = req.query;
    const readings = await readingService.listReadings(req.user.id, { date });

    res.status(200).json({
      success: true,
      data: readings,
    });
  } catch (error) {
    next(error);
  }
};

export const getOne = async (req, res, next) => {
  try {
    const { id } = req.params;
    validateReadingId(id);
    const reading = await readingService.getReadingById(req.user.id, id);

    res.status(200).json({
      success: true,
      data: reading,
    });
  } catch (error) {
    next(error);
  }
};

export const update = async (req, res, next) => {
  try {
    const { id } = req.params;
    validateReadingId(id);
    const validatedData = validateReadingInput(req.body);
    const updated = await readingService.updateReading(req.user.id, id, validatedData);

    res.status(200).json({
      success: true,
      message: 'Reading updated successfully.',
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};

export const remove = async (req, res, next) => {
  try {
    const { id } = req.params;
    validateReadingId(id);
    await readingService.deleteReading(req.user.id, id);

    res.status(200).json({
      success: true,
      message: 'Reading deleted successfully.',
    });
  } catch (error) {
    next(error);
  }
};
