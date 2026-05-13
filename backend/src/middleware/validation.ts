import { Request, Response, NextFunction } from 'express';
import { body, validationResult } from 'express-validator';

export const handleValidationErrors = (req: Request, res: Response, next: NextFunction): void => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
    return;
  }
  next();
};

export const validateUserRegistration = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('phone').notEmpty().withMessage('Phone number is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
  handleValidationErrors
];

export const validateUserLogin = [
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required'),
  handleValidationErrors
];

export const validateFieldCreation = [
  body('name').trim().notEmpty().withMessage('Field name is required'),
  body('address').trim().notEmpty().withMessage('Address is required'),
  body('price').isNumeric().withMessage('Price must be a number'),
  body('description').trim().notEmpty().withMessage('Description is required'),
  body('image').optional().isString().withMessage('Image URL must be a string'),
  body('features').optional().isArray().withMessage('Features must be an array'),
  body('rating').optional().isFloat({ min: 0, max: 5 }).withMessage('Rating must be between 0 and 5'),
  handleValidationErrors
];

export const validateReservation = [
  body('fieldId').notEmpty().withMessage('Field ID is required'),
  body('date').notEmpty().withMessage('Date is required'),
  body('timeSlot.id').notEmpty().withMessage('Time slot ID is required'),
  body('timeSlot.startTime').notEmpty().withMessage('Start time is required'),
  body('timeSlot.endTime').notEmpty().withMessage('End time is required'),
  body('totalPrice').isNumeric().withMessage('Total price must be a number'),
  handleValidationErrors
];
