import { Router } from 'express';
import {
  createReservation,
  getUserReservations,
  getReservationById,
  cancelReservation,
  getAllReservations
} from '../controllers/reservationController';
import { authenticate, authorize } from '../middleware/auth';
import { validateReservation } from '../middleware/validation';

const router = Router();

router.post('/', authenticate, validateReservation, createReservation);
router.get('/my', authenticate, getUserReservations);
router.get('/all', authenticate, authorize(['admin']), getAllReservations);
router.get('/:id', authenticate, getReservationById);
router.put('/:id/cancel', authenticate, cancelReservation);

export default router;
