import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { Field } from '../models/Field';
import { User, Reservation } from '../models/User';

function addDays(base: Date, days: number): string {
  const d = new Date(base);
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

function buildTimeSlot(field: any, slotIndex: number, dateStr: string) {
  const s = field.availableSlots[slotIndex];
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

export const seedData = async (): Promise<void> => {
  try {
    await Reservation.deleteMany({});
    await Field.deleteMany({});
    await User.deleteMany({});

    const fields = [
      {
        name: 'Terrain Les Verts',
        address: 'Temara',
        price: 10,
        description: 'Terrain de football de haute qualité avec éclairage professionnel, vestiaires modernes et parking sécurisé. Idéal pour les matchs de compétition et les entraînements.',
        image: '/images/image1.jpg',
        features: ['Éclairage LED', 'Vestiaires avec douches', 'Parking gratuit', 'Tribunes (100 places)', 'Surface synthétique FIFA'],
        availableSlots: generateTimeSlots(),
        rating: 4.8
      },
      {
        name: 'Complex Sportif Le Parc',
        address: 'RABAT',
        price: 12,
        description: 'Complexe sportif moderne avec deux terrains de football, équipement de dernière génération et infrastructure complète pour les équipes.',
        image: '/field2.jpg',
        features: ['Surface synthétique', 'Éclairage puissant', 'Tribunes couvertes', 'Bar/Restaurant', 'Parking surveillé'],
        availableSlots: generateTimeSlots(),
        rating: 4.6
      },
      {
        name: 'Terrain Académie Salhy',
        address: 'AIN ATIQ',
        price: 15,
        description: 'Terrain traditionnel en gazon naturel parfaitement entretenu, ambiance conviviale et idéale pour le football de loisir.',
        image: '/field3.jpg',
        features: ['Gazon naturel', 'Vestiaires', 'Douches chaudes', 'Zone de pique-nique', 'Accès PMR'],
        availableSlots: generateTimeSlots(),
        rating: 4.9
      },
      {
        name: 'Indoor Football Center',
        address: '56 Rue Couverte, Lille',
        price: 45,
        description: 'Terrain intérieur climatisé, parfait pour jouer toute l\'année quel que soit le temps. Surface spécifique pour football en salle.',
        image: '/field4.jpg',
        features: ['Intérieur climatisé', 'Surface spécifique indoor', 'Vestiaires modernes', 'Cafétéria', 'Wi-Fi gratuit'],
        availableSlots: generateTimeSlots(),
        rating: 4.7
      },
      {
        name: 'Stade Universitaire',
        address: '90 Campus Sport, Bordeaux',
        price: 25,
        description: 'Terrain abordable situé sur le campus universitaire, idéal pour les étudiants et les jeunes joueurs. Ambiance dynamique.',
        image: '/field5.jpg',
        features: ['Prix étudiant', 'Éclairage', 'Vestiaires basiques', 'Proche transports', 'Zone de repos'],
        availableSlots: generateTimeSlots(),
        rating: 4.5
      },
      {
        name: 'Terrain El Mansour',
        address: 'Avenue Mohammed VI, Casablanca',
        price: 30,
        description: 'Terrain professionnel avec surface synthétique de dernière génération, idéal pour les compétitions et entraînements intensifs.',
        image: '/field6.jpg',
        features: ['Surface synthétique pro', 'Éclairage LED', 'Vestiaires premium', 'Caméras surveillance', 'WiFi gratuit'],
        availableSlots: generateTimeSlots(),
        rating: 4.7
      }
    ];

    const createdFields = await Field.insertMany(fields);
    console.log(`${createdFields.length} fields created`);

    const adminUser = new User({
      name: 'Admin User',
      email: 'admin@footballreservation.com',
      phone: '+212600000000',
      password: 'admin123',
      role: 'admin'
    });

    await adminUser.save();
    console.log('Admin user created');

    const saraUser = new User({
      name: 'Sara Chetouane',
      email: 'adminsara@footballreservation.com',
      phone: '0677777777',
      password: 'admin123',
      role: 'admin',
    });
    await saraUser.save();
    console.log('Demo user Sara created');

    const today = new Date();
    const futureDate = addDays(today, 21);
    const pastDate = addDays(today, -40);
    const field0 = createdFields[0] as any;
    const field1 = createdFields[1] as any;

    await Reservation.insertMany([
      {
        fieldId: field0._id,
        userId: saraUser._id,
        date: futureDate,
        timeSlot: buildTimeSlot(field0, 5, futureDate),
        totalPrice: field0.price,
        status: 'confirmed',
      },
      {
        fieldId: field0._id,
        userId: saraUser._id,
        date: pastDate,
        timeSlot: buildTimeSlot(field0, 3, pastDate),
        totalPrice: field0.price,
        status: 'confirmed',
      },
      {
        fieldId: field1._id,
        userId: saraUser._id,
        date: pastDate,
        timeSlot: buildTimeSlot(field1, 2, pastDate),
        totalPrice: 35,
        status: 'cancelled',
      },
      {
        fieldId: field0._id,
        userId: adminUser._id,
        date: futureDate,
        timeSlot: buildTimeSlot(field0, 6, futureDate),
        totalPrice: field0.price,
        status: 'pending',
      },
    ]);
    console.log('Sample reservations created for Sara and admin');

    console.log('Database seeded successfully');
    console.log('Comptes démo — mot de passe: admin123');
    console.log('  - admin@footballreservation.com');
    console.log('  - adminsara@footballreservation.com');
  } catch (error) {
    console.error('Error seeding database:', error);
  }
};

function generateTimeSlots(): any[] {
  const slots: any[] = [];
  const startTimes = ['08:00', '09:30', '11:00', '14:00', '15:30', '17:00', '18:30', '20:00'];
  
  startTimes.forEach((startTime, index) => {
    const endTime = calculateEndTime(startTime);
    slots.push({
      id: `slot-${index + 1}`,
      startTime,
      endTime,
      available: Math.random() > 0.3,
      price: Math.floor(Math.random() * 20) + 25,
      date: new Date().toISOString().split('T')[0]
    });
  });
  
  return slots;
}

function calculateEndTime(startTime: string): string {
  const [hours, minutes] = startTime.split(':').map(Number);
  const endHours = hours + 1;
  const endMinutes = minutes + 30;
  
  if (endMinutes >= 60) {
    return `${endHours + 1}:00`;
  }
  
  return `${endHours}:${endMinutes.toString().padStart(2, '0')}`;
}

/** Exécution : `npm run seed` depuis le dossier backend */
if (require.main === module) {
  dotenv.config();
  (async () => {
    try {
      const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/football_reservation';
      await mongoose.connect(uri);
      await seedData();
    } catch (e) {
      console.error(e);
      process.exitCode = 1;
    } finally {
      await mongoose.disconnect();
    }
    process.exit(process.exitCode ?? 0);
  })();
}
