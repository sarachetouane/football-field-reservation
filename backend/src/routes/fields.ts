import { Router } from 'express';
import {
  getFields,
  getFieldById,
  createField,
  updateField,
  deleteField
} from '../controllers/fieldController';
import { authenticate, authorize } from '../middleware/auth';
import { validateFieldCreation } from '../middleware/validation';

const router = Router();

router.get('/', getFields);
router.get('/:id', getFieldById);
router.post('/', authenticate, authorize(['admin']), validateFieldCreation, createField);
router.put('/:id', authenticate, authorize(['admin']), updateField);
router.delete('/:id', authenticate, authorize(['admin']), deleteField);

export default router;
