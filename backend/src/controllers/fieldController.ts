import { Response, NextFunction } from 'express';
import { Field } from '../models/Field';
import { AuthRequest, ApiResponse, PaginationParams } from '../types';

export const getFields = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const search = req.query.search as string || '';
    const sortBy = req.query.sortBy as string || 'createdAt';
    const sortOrder = req.query.sortOrder as string || 'desc';
    
    const skip = (page - 1) * limit;
    
    let query = {};
    if (search) {
      query = {
        $or: [
          { name: { $regex: search, $options: 'i' } },
          { address: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } }
        ]
      };
    }
    
    const sortOptions: { [key: string]: 1 | -1 } = {};
    sortOptions[sortBy] = sortOrder === 'asc' ? 1 : -1;
    
    const fields = await Field.find(query)
      .sort(sortOptions)
      .skip(skip)
      .limit(limit);
    
    // Transform _id to id for frontend compatibility
    const transformedFields = fields.map(field => {
      const fieldObj = field.toObject();
      const { _id, ...rest } = fieldObj;
      return {
        ...rest,
        id: field._id.toString(),
        availableSlots: fieldObj.availableSlots.map((slot: any) => {
          const { _id: slotId, ...slotRest } = slot;
          return {
            ...slotRest,
            id: slot._id ? slot._id.toString() : slot.id
          };
        })
      };
    });
    
    const total = await Field.countDocuments(query);
    
    res.status(200).json({
      success: true,
      message: 'Fields retrieved successfully',
      data: transformedFields,
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

export const getFieldById = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const field = await Field.findById(req.params.id);
    
    if (!field) {
      res.status(404).json({
        success: false,
        message: 'Field not found'
      });
      return;
    }
    
    // Transform _id to id for frontend compatibility
    const fieldObj = field.toObject();
    const { _id, ...rest } = fieldObj;
    const transformedField = {
      ...rest,
      id: field._id.toString(),
      availableSlots: fieldObj.availableSlots.map((slot: any) => {
        const { _id: slotId, ...slotRest } = slot;
        return {
          ...slotRest,
          id: slot._id ? slot._id.toString() : slot.id
        };
      })
    };
    
    res.status(200).json({
      success: true,
      message: 'Field retrieved successfully',
      data: transformedField
    });
  } catch (error) {
    next(error);
  }
};

export const createField = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const field = new Field(req.body);
    await field.save();
    
    res.status(201).json({
      success: true,
      message: 'Field created successfully',
      data: field
    });
  } catch (error) {
    next(error);
  }
};

export const updateField = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const field = await Field.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!field) {
      res.status(404).json({
        success: false,
        message: 'Field not found'
      });
      return;
    }
    
    res.status(200).json({
      success: true,
      message: 'Field updated successfully',
      data: field
    });
  } catch (error) {
    next(error);
  }
};

export const deleteField = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const field = await Field.findByIdAndDelete(req.params.id);
    
    if (!field) {
      res.status(404).json({
        success: false,
        message: 'Field not found'
      });
      return;
    }
    
    res.status(200).json({
      success: true,
      message: 'Field deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};
