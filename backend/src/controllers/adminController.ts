import { Request, Response } from 'express';
import { AuthRequest } from '../types';
import { Field } from '../models/Field';
import { validationResult } from 'express-validator';

// Create a new field
export const createField = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
      return;
    }

    const {
      name,
      address,
      price,
      description,
      image,
      features,
      rating
    } = req.body;

    // Generate time slots for the new field
    const generateTimeSlots = (fieldId: string) => {
      const slots: any[] = [];
      const times = [
        '08:00-09:30', '09:30-11:00', '11:00-12:30', '14:00-15:30',
        '15:30-17:00', '17:00-18:30', '18:30-20:00', '20:00-21:30'
      ];
      
      const today = new Date();
      for (let i = 0; i < 30; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() + i);
        const dateStr = date.toISOString().split('T')[0];
        
        times.forEach((time, index) => {
          const [startTime, endTime] = time.split('-');
          slots.push({
            id: `${dateStr}-${index}`,
            startTime,
            endTime,
            available: Math.random() > 0.3, // 70% availability
            price: price,
            fieldId: fieldId,
            date: dateStr
          });
        });
      }
      return slots;
    };

    // Create field without time slots first
    const fieldData = {
      name,
      address,
      price,
      description,
      image: image || '/images/default-field.jpg',
      features: features || [],
      availableSlots: [],
      rating: rating || 4.5
    };

    const newField = new Field(fieldData);
    const savedField = await newField.save();

    // Generate time slots with proper fieldId
    const timeSlots = generateTimeSlots(savedField._id.toString());
    
    // Update field with time slots
    savedField.availableSlots = timeSlots;
    await savedField.save();

    res.status(201).json({
      success: true,
      message: 'Field created successfully',
      data: savedField
    });
  } catch (error) {
    console.error('Create field error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating field',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Update an existing field
export const updateField = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
      return;
    }

    const { id } = req.params;
    const updateData = req.body;

    const field = await Field.findById(id);
    if (!field) {
      res.status(404).json({
        success: false,
        message: 'Field not found'
      });
      return;
    }

    const updatedField = await Field.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      message: 'Field updated successfully',
      data: updatedField
    });
  } catch (error) {
    console.error('Update field error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating field',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Delete a field
export const deleteField = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const field = await Field.findById(id);
    if (!field) {
      res.status(404).json({
        success: false,
        message: 'Field not found'
      });
      return;
    }

    await Field.findByIdAndDelete(id);

    res.json({
      success: true,
      message: 'Field deleted successfully'
    });
  } catch (error) {
    console.error('Delete field error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting field',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Get all fields for admin (with more details)
export const getAdminFields = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { page = 1, limit = 10, search } = req.query;
    
    const query: any = {};
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { address: { $regex: search, $options: 'i' } }
      ];
    }

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    const [fields, total] = await Promise.all([
      Field.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum),
      Field.countDocuments(query)
    ]);

    res.json({
      success: true,
      data: fields,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum)
      }
    });
  } catch (error) {
    console.error('Get admin fields error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching fields',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};
