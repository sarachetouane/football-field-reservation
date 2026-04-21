import { Field, TimeSlot } from '../types';

export const mockFields: Field[] = [
  {
    id: '1',
    name: 'Terrain Les Verts',
    address: 'Temara',
    price: 10,
    description: 'Terrain de football de haute qualité avec éclairage professionnel, vestiaires modernes et parking sécurisé. Idéal pour les matchs de compétition et les entraînements.',
    image: '/images/image1.jpg',
    features: ['Éclairage LED', 'Vestiaires avec douches', 'Parking gratuit', 'Tribunes (100 places)', 'Surface synthétique FIFA'],
    availableSlots: generateTimeSlots()
  },
  {
    id: '2',
    name: 'Complex Sportif Le Parc',
    address: 'RABAT',
    price: 12,
    description: 'Complexe sportif moderne avec deux terrains de football, équipement de dernière génération et infrastructure complète pour les équipes.',
    image: '/field2.jpg',
    features: ['Surface synthétique', 'Éclairage puissant', 'Tribunes couvertes', 'Bar/Restaurant', 'Parking surveillé'],
    availableSlots: generateTimeSlots()
  },
  {
    id: '3',
    name: 'Terrain Académie Salhy',
    address: 'AIN ATIQ',
    price: 15,
    description: 'Terrain traditionnel en gazon naturel parfaitement entretenu, ambiance conviviale et idéale pour le football de loisir.',
    image: '/field3.jpg',
    features: ['Gazon naturel', 'Vestiaires', 'Douches chaudes', 'Zone de pique-nique', 'Accès PMR'],
    availableSlots: generateTimeSlots()
  },
  {
    id: '4',
    name: 'Indoor Football Center',
    address: '56 Rue Couverte, Lille',
    price: 45,
    description: 'Terrain intérieur climatisé, parfait pour jouer toute l\'année quel que soit le temps. Surface spécifique pour football en salle.',
    image: '/field4.jpg',
    features: ['Intérieur climatisé', 'Surface spécifique indoor', 'Vestiaires modernes', 'Cafétéria', 'Wi-Fi gratuit'],
    availableSlots: generateTimeSlots()
  },
  {
    id: '5',
    name: 'Stade Universitaire',
    address: '90 Campus Sport, Bordeaux',
    price: 25,
    description: 'Terrain abordable situé sur le campus universitaire, idéal pour les étudiants et les jeunes joueurs. Ambiance dynamique.',
    image: '/field5.jpg',
    features: ['Prix étudiant', 'Éclairage', 'Vestiaires basiques', 'Proche transports', 'Zone de repos'],
    availableSlots: generateTimeSlots()
  }
];

function generateTimeSlots(): TimeSlot[] {
  const slots: TimeSlot[] = [];
  const startTimes = ['08:00', '09:30', '11:00', '14:00', '15:30', '17:00', '18:30', '20:00'];
  
  startTimes.forEach((startTime, index) => {
    const endTime = calculateEndTime(startTime);
    slots.push({
      id: `slot-${index + 1}`,
      startTime,
      endTime,
      available: Math.random() > 0.3, // 70% availability
      price: Math.floor(Math.random() * 20) + 25
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

export const formatPrice = (price: number): string => {
  return `${price}e`;
};

export const formatDate = (date: string): string => {
  const dateObj = new Date(date);
  return dateObj.toLocaleDateString('fr-FR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

export const formatTime = (time: string): string => {
  return time;
};
