import { Response, NextFunction } from 'express';
import { Reservation } from '../models/User';
import { Field } from '../models/Field';
import { AuthRequest, ApiResponse } from '../types';

export const createReservation = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'User not authenticated'
      });
      return;
    }

    const { fieldId, date, timeSlot, totalPrice } = req.body;

    const field = await Field.findById(fieldId);
    if (!field) {
      res.status(404).json({
        success: false,
        message: 'Field not found'
      });
      return;
    }

    const existingReservation = await Reservation.findOne({
      fieldId,
      date,
      'timeSlot.id': timeSlot.id,
      status: { $in: ['pending', 'confirmed'] }
    });

    if (existingReservation) {
      res.status(400).json({
        success: false,
        message: 'This time slot is already booked'
      });
      return;
    }

    const reservation = new Reservation({
      fieldId,
      userId: req.user._id,
      date,
      timeSlot,
      totalPrice,
      status: 'pending'
    });

    await reservation.save();

    await Field.findByIdAndUpdate(
      fieldId,
      { 
        $set: { 
          'availableSlots.$[elem].available': false 
        } 
      },
      { 
        arrayFilters: [{ 'elem.id': timeSlot.id }] 
      }
    );

    res.status(201).json({
      success: true,
      message: 'Reservation created successfully',
      data: reservation
    });
  } catch (error) {
    next(error);
  }
};

export const getUserReservations = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'User not authenticated'
      });
      return;
    }

    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const status = req.query.status as string;

    const skip = (page - 1) * limit;
    
    let query: any = { userId: req.user._id };
    if (status) {
      query.status = status;
    }

    const reservations = await Reservation.find(query)
      .populate('fieldId', 'name address image price')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Reservation.countDocuments(query);

    res.status(200).json({
      success: true,
      message: 'Reservations retrieved successfully',
      data: reservations,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    next(error);
  }
};

export const getReservationById = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'User not authenticated'
      });
      return;
    }

    const reservation = await Reservation.findById(req.params.id)
      .populate('fieldId', 'name address image price features');

    if (!reservation) {
      res.status(404).json({
        success: false,
        message: 'Reservation not found'
      });
      return;
    }

    if (reservation.userId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      res.status(403).json({
        success: false,
        message: 'Access denied'
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Reservation retrieved successfully',
      data: reservation
    });
  } catch (error) {
    next(error);
  }
};

export const cancelReservation = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'User not authenticated'
      });
      return;
    }

    const reservation = await Reservation.findById(req.params.id);

    if (!reservation) {
      res.status(404).json({
        success: false,
        message: 'Reservation not found'
      });
      return;
    }

    if (reservation.userId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      res.status(403).json({
        success: false,
        message: 'Access denied'
      });
      return;
    }

    if (reservation.status === 'cancelled') {
      res.status(400).json({
        success: false,
        message: 'Reservation is already cancelled'
      });
      return;
    }

    reservation.status = 'cancelled';
    await reservation.save();

    await Field.findByIdAndUpdate(
      reservation.fieldId,
      { 
        $set: { 
          'availableSlots.$[elem].available': true 
        } 
      },
      { 
        arrayFilters: [{ 'elem.id': reservation.timeSlot.id }] 
      }
    );

    res.status(200).json({
      success: true,
      message: 'Reservation cancelled successfully',
      data: reservation
    });
  } catch (error) {
    next(error);
  }
};

export const getAllReservations = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user || req.user.role !== 'admin') {
      res.status(403).json({
        success: false,
        message: 'Access denied. Admin role required.'
      });
      return;
    }

    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const status = req.query.status as string;

    const skip = (page - 1) * limit;
    
    let query: any = {};
    if (status) {
      query.status = status;
    }

    const reservations = await Reservation.find(query)
      .populate('fieldId', 'name address image price')
      .populate('userId', 'name email phone')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Reservation.countDocuments(query);

    res.status(200).json({
      success: true,
      message: 'All reservations retrieved successfully',
      data: reservations,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    next(error);
  }
};
