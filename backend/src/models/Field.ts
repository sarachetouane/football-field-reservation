import mongoose, { Schema, Document } from 'mongoose';
import { Field as IField, TimeSlot as ITimeSlot } from '../types';

interface TimeSlotDocument extends Omit<ITimeSlot, 'id'>, Document {}

const TimeSlotSchema: Schema = new Schema({
  startTime: { type: String, required: true },
  endTime: { type: String, required: true },
  available: { type: Boolean, default: true },
  price: { type: Number },
  fieldId: { type: Schema.Types.ObjectId, ref: 'Field', required: false },
  date: { type: String, required: true }
}, { timestamps: true });

const FieldSchema: Schema = new Schema({
  name: { type: String, required: true, trim: true },
  address: { type: String, required: true, trim: true },
  price: { type: Number, required: true, min: 0 },
  description: { type: String, required: true, trim: true },
  image: { type: String, default: '/images/default-field.jpg' },
  features: [{ type: String, trim: true }],
  availableSlots: [TimeSlotSchema],
  rating: { type: Number, min: 0, max: 5, default: 4.5 }
}, { timestamps: true });

FieldSchema.index({ name: 'text', address: 'text' });
FieldSchema.index({ price: 1 });
FieldSchema.index({ rating: -1 });

export const Field = mongoose.model<IField & Document>('Field', FieldSchema);
export const TimeSlot = mongoose.model<TimeSlotDocument>('TimeSlot', TimeSlotSchema);
