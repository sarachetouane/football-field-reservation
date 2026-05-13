/**
 * Ajoute des réservations de démo (Sara + admin) sans supprimer le reste.
 * Usage: npm run seed:sara-reservations
 */
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { ensureDevDemoReservations } from './ensureDevDemoReservations';

dotenv.config();

async function main(): Promise<void> {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/football_reservation';
  await mongoose.connect(uri);
  console.log('MongoDB connecté');
  await ensureDevDemoReservations();
}

main()
  .catch((e) => {
    console.error(e);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.disconnect();
  });
