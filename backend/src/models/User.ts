import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcryptjs';
import { User as IUser, Reservation as IReservation } from '../types';

interface ReservationDocument extends Omit<IReservation, 'id'>, Document {}

const ReservationSchema: Schema = new Schema({
  fieldId: { type: Schema.Types.ObjectId, ref: 'Field', required: true },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: String, required: true },
  timeSlot: {
    id: { type: String, required: true },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    available: { type: Boolean, required: true },
    price: { type: Number },
    fieldId: { type: Schema.Types.ObjectId, ref: 'Field', required: true },
    date: { type: String, required: true }
  },
  totalPrice: { type: Number, required: true, min: 0 },
  status: { type: String, enum: ['pending', 'confirmed', 'cancelled'], default: 'pending' }
}, { timestamps: true });

const UserSchema: Schema = new Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  phone: { type: String, required: true, trim: true },
  password: { type: String, required: true, minlength: 6 },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  reservations: [ReservationSchema]
}, { timestamps: true });

UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error as Error);
  }
});

UserSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

UserSchema.index({ email: 1 });
UserSchema.index({ name: 1 });

export const User = mongoose.model<IUser & Document>('User', UserSchema);
export const Reservation = mongoose.model<ReservationDocument>('Reservation', ReservationSchema);
