import express from 'express';
import { authenticate, authorize } from '../middleware/auth';
import { createField, updateField, deleteField, getAdminFields } from '../controllers/adminController';
import { validateFieldCreation } from '../middleware/validation';
import { Field } from '../models/Field';
import { User, Reservation } from '../models/User';

const router = express.Router();

// All admin routes require authentication and admin role
router.use(authenticate);
router.use(authorize(['admin']));

// Field management routes
router.post('/fields', validateFieldCreation, createField);
router.put('/fields/:id', updateField);
router.delete('/fields/:id', deleteField);
router.get('/fields', getAdminFields);

// Dashboard statistics
router.get('/dashboard/stats', async (req, res) => {
  try {

    const [
      totalFields,
      totalUsers,
      totalReservations,
      recentReservations
    ] = await Promise.all([
      Field.countDocuments(),
      User.countDocuments(),
      Reservation.countDocuments(),
      Reservation.find()
        .populate('fieldId', 'name')
        .populate('userId', 'name email')
        .sort({ createdAt: -1 })
        .limit(10)
    ]);

    res.json({
      success: true,
      data: {
        stats: {
          totalFields,
          totalUsers,
          totalReservations
        },
        recentReservations
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching dashboard data',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export default router;
