import { UserRole } from '@/modules/roles/enums/role.enum';

export const TEST_USERS = [
  {
    name: 'Admin User',
    email: 'admin@example.com',
    password: 'Password123!',
    role: UserRole.ADMIN,
  },
  {
    name: 'Consultant User',
    email: 'consultant@example.com',
    password: 'Password123!',
    role: UserRole.CONSULTANT,
  },
  {
    name: 'Client User',
    email: 'client@example.com',
    password: 'Password123!',
    role: UserRole.CLIENT,
  },
];

export const CLIENTS_DATA = [
  {
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+1-555-0192',
    address: '742 Evergreen Terrace, Springfield',
  },
  {
    name: 'Sarah Smith',
    email: 'sarah.smith@example.com',
    phone: '+44-20-7946-0912',
    address: '10 Downing Street, London',
  },
  {
    name: 'Robert Chen',
    email: 'robert.chen@example.com',
    phone: '+65-6789-0123',
    address: 'Orchard Road, Singapore',
  },
];

export const DESTINATIONS_DATA = [
  {
    name: 'Kerala',
    country: 'India',
    description:
      'God’s Own Country featuring backwaters, beaches, and tea plantations.',
  },
  {
    name: 'Bali',
    country: 'Indonesia',
    description:
      'Island of the Gods known for forested volcanic mountains and rice paddies.',
  },
  {
    name: 'Swiss Alps',
    country: 'Switzerland',
    description:
      'Dramatic snow-capped mountain peaks, lakes, and picturesque villages.',
  },
];

export const HOTELS_DATA = [
  // Kerala Hotels
  {
    destKey: 'Kerala',
    name: 'Grand Hyatt Kochi Bolgatty',
    starRating: 5,
  },
  {
    destKey: 'Kerala',
    name: 'Munnar Tea Hills Resort',
    starRating: 4,
  },
  {
    destKey: 'Kerala',
    name: 'The Leaf Munnar',
    starRating: 4,
  },
  {
    destKey: 'Kerala',
    name: 'Kumarakom Lake Resort',
    starRating: 5,
  },
  {
    destKey: 'Kerala',
    name: 'Marari Beach Resort - CGH Earth',
    starRating: 5,
  },

  // Bali Hotels
  {
    destKey: 'Bali',
    name: 'AYANA Resort Bali',
    starRating: 5,
  },
  {
    destKey: 'Bali',
    name: 'The Ubud Village Resort & Spa',
    starRating: 4,
  },
  {
    destKey: 'Bali',
    name: 'Padma Resort Ubud',
    starRating: 5,
  },
  {
    destKey: 'Bali',
    name: 'Grand Hyatt Bali',
    starRating: 5,
  },
  {
    destKey: 'Bali',
    name: 'Seminyak Beach Resort',
    starRating: 4,
  },

  // Swiss Alps Hotels
  {
    destKey: 'Swiss Alps',
    name: 'The Chedi Andermatt',
    starRating: 5,
  },
  {
    destKey: 'Swiss Alps',
    name: 'Grand Hotel Zermatterhof',
    starRating: 5,
  },
  {
    destKey: 'Swiss Alps',
    name: 'Hotel Bellevue Wengen',
    starRating: 4,
  },
  {
    destKey: 'Swiss Alps',
    name: 'Sunstar Hotel Grindelwald',
    starRating: 4,
  },
  {
    destKey: 'Swiss Alps',
    name: "Badrutt's Palace Hotel St. Moritz",
    starRating: 5,
  },
];

export const CONSULTANTS_DATA = [
  {
    name: 'Alex Morgan',
    email: 'alex.morgan@auratours.com',
    phone: '+1-555-0144',
    designation: 'Senior Luxury Travel Consultant',
  },
  {
    name: 'Priya Sharma',
    email: 'priya.sharma@auratours.com',
    phone: '+91-98765-43210',
    designation: 'Kerala & South Asia Tour Specialist',
  },
];

export const KERALA_5DAY_ITINERARY = [
  {
    dayNumber: 1,
    hotelKey: 'Grand Hyatt Kochi Bolgatty',
    notes:
      'Arrival at Cochin International Airport (COK). Private luxury transfer to Bolgatty Island.',
  },
  {
    dayNumber: 2,
    hotelKey: 'The Leaf Munnar',
    notes:
      'Scenic drive from Kochi to Munnar (approx. 4 hours) stopping at waterfalls.',
  },
  {
    dayNumber: 3,
    hotelKey: 'The Leaf Munnar',
    notes: 'Full day sightseeing in Munnar mountain trails.',
  },
  {
    dayNumber: 4,
    hotelKey: 'Kumarakom Lake Resort',
    notes: 'Drive from Munnar to Kumarakom backwaters (approx. 4.5 hours).',
  },
  {
    dayNumber: 5,
    hotelKey: 'Grand Hyatt Kochi Bolgatty',
    notes:
      'Morning at leisure. Transfer to Cochin International Airport for departure.',
  },
];
