import mongoose from 'mongoose';
import { User, Reservation } from '../models/User';
import { Field } from '../models/Field';

function addDays(base: Date, days: number): string {
  const d = new Date(base);
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

function buildTimeSlot(field: any, slotIndex: number, dateStr: string) {
  const s = field.availableSlots?.[slotIndex];
  if (!s) {
    throw new Error(`Terrain "${field.name}" : créneau index ${slotIndex} introuvable`);
  }
  return {
    id: s.id,
    startTime: s.startTime,
    endTime: s.endTime,
    available: false,
    price: s.price ?? field.price,
    fieldId: field._id,
    date: dateStr,
  };
}

/**
 * Si des comptes démo existent sans aucune réservation, en ajoute (dev / données locales).
 * Sans effet si l’utilisateur n’existe pas, s’il a déjà des réservations, ou s’il n’y a aucun terrain.
 */
export async function ensureDevDemoReservations(): Promise<void> {
  if (mongoose.connection.readyState !== 1) {
    return;
  }

  const field0 = await Field.findOne().sort({ createdAt: 1 });
  if (!field0) {
    return;
  }

  const field1 = (await Field.findOne().sort({ createdAt: 1 }).skip(1)) || field0;
  const today = new Date();
  const futureDate = addDays(today, 21);
  const pastDate = addDays(today, -40);

  const saraEmail = 'adminsara@footballreservation.com';
  const sara = await User.findOne({ email: saraEmail.toLowerCase() });
  if (sara && (await Reservation.countDocuments({ userId: sara._id })) === 0) {
    await Reservation.insertMany([
      {
        fieldId: field0._id,
        userId: sara._id,
        date: futureDate,
        timeSlot: buildTimeSlot(field0, 5, futureDate),
        totalPrice: field0.price,
        status: 'confirmed',
      },
      {
        fieldId: field0._id,
        userId: sara._id,
        date: pastDate,
        timeSlot: buildTimeSlot(field0, 3, pastDate),
        totalPrice: field0.price,
        status: 'confirmed',
      },
      {
        fieldId: field1._id,
        userId: sara._id,
        date: pastDate,
        timeSlot: buildTimeSlot(field1, 2, pastDate),
        totalPrice: 35,
        status: 'cancelled',
      },
    ]);
    console.log(`[demo] 3 réservations ajoutées pour ${saraEmail}`);
  }

  const adminEmail = 'admin@footballreservation.com';
  const admin = await User.findOne({ email: adminEmail.toLowerCase() });
  if (admin && (await Reservation.countDocuments({ userId: admin._id })) === 0) {
    await Reservation.insertMany([
      {
        fieldId: field0._id,
        userId: admin._id,
        date: futureDate,
        timeSlot: buildTimeSlot(field0, 6, futureDate),
        totalPrice: field0.price,
        status: 'pending',
      },
    ]);
    console.log(`[demo] 1 réservation ajoutée pour ${adminEmail}`);
  }
}
