import { toast } from "@/components/ui/sonner";

// Mock hotel data
export const mockHotels = [
  {
    id: '1',
    name: 'The Ritz-Carlton Jakarta',
    description: 'Experience luxury at its finest in the heart of Jakarta with world-class amenities and impeccable service.',
    address: 'Jl. DR IDE Anak Agung Gde Agung Kav.E.1.1 No.1, Mega Kuningan, Jakarta',
    price: 3500000, // in IDR
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    rooms: 120,
    amenities: ['Pool', 'Spa', 'Gym', 'Restaurant', 'Bar', 'Room service', 'Free WiFi'],
    providerId: 'provider-1'
  },
  {
    id: '2',
    name: 'Ayana Resort Bali',
    description: 'A stunning clifftop retreat overlooking the Indian Ocean, offering ultimate luxury and Balinese hospitality.',
    address: 'Jl. Karang Mas Sejahtera, Jimbaran, Bali',
    price: 2800000,
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    rooms: 75,
    amenities: ['Private Beach', 'Infinity Pool', 'Spa', 'Multiple Restaurants', 'Bar', 'Rock Bar'],
    providerId: 'provider-1'
  },
  {
    id: '3',
    name: 'Mandarin Oriental Jakarta',
    description: 'Contemporary luxury hotel in the heart of Jakarta\'s financial and diplomatic district.',
    address: 'Jl. M.H. Thamrin, Jakarta Pusat',
    price: 4200000,
    rating: 4.7,
    image: 'https://images.unsplash.com/photo-1618773928121-c32242e63f44d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    rooms: 50,
    amenities: ['Pool', 'Spa', 'Gym', 'Restaurant', 'Bar', 'Room service', 'Free WiFi', 'Business center'],
    providerId: 'provider-1'
  },
  {
    id: '4',
    name: 'Four Seasons Resort Jimbaran',
    description: 'Luxurious beachfront villas with traditional Balinese architecture and modern amenities.',
    address: 'Jimbaran Bay, Bali',
    price: 5500000,
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    rooms: 200,
    amenities: ['Private beach', 'Pool', 'Spa', 'Gym', 'Multiple restaurants', 'Water sports'],
    providerId: 'provider-1'
  },
  {
    id: '5',
    name: 'Hotel Indonesia Kempinski Jakarta',
    description: 'Historic luxury hotel with modern amenities in the heart of Jakarta.',
    address: 'Jl. M.H. Thamrin No.1, Jakarta Pusat',
    price: 2900000,
    rating: 4.6,
    image: 'https://images.unsplash.com/photo-1519449556851-5720b33024e7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    rooms: 150,
    amenities: ['Restaurant', 'Bar', 'Spa', 'Free WiFi', 'Room service', 'Concierge'],
    providerId: 'provider-1'
  },
  {
    id: '6',
    name: 'Mulia Resort Nusa Dua',
    description: 'Luxurious beachfront resort with world-class facilities and impeccable service.',
    address: 'Jl. Raya Nusa Dua Selatan, Kawasan Sawangan, Nusa Dua, Bali',
    price: 3800000,
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    rooms: 100,
    amenities: ['Private Beach', 'Multiple Pools', 'Spa', 'Restaurants', 'Beach Club', 'Fitness Center'],
    providerId: 'provider-1'
  }
];

// Mock bookings data
export const mockBookings = [
  {
    id: '1',
    hotelId: '1',
    consumerId: 'consumer-1',
    checkIn: '2025-05-01',
    checkOut: '2025-05-05',
    guests: 2,
    status: 'pending',
    totalPrice: 1000,
    createdAt: '2025-04-01T12:00:00Z'
  },
  {
    id: '2',
    hotelId: '3',
    consumerId: 'consumer-1',
    checkIn: '2025-06-10',
    checkOut: '2025-06-15',
    guests: 1,
    status: 'confirmed',
    totalPrice: 1750,
    createdAt: '2025-04-05T09:30:00Z'
  },
  {
    id: '3',
    hotelId: '2',
    consumerId: 'consumer-1',
    checkIn: '2025-07-20',
    checkOut: '2025-07-25',
    guests: 3,
    status: 'rejected',
    totalPrice: 750,
    createdAt: '2025-04-10T15:45:00Z'
  }
];

// Helper to simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Helper to get local storage arrays with fallback
const getStorageArray = (key: string) => {
  const item = localStorage.getItem(key);
  return item ? JSON.parse(item) : [];
};

// Hotel APIs
export const fetchHotels = async () => {
  await delay(800);
  
  // Try to get from localStorage first, fallback to mock data
  const storedHotels = localStorage.getItem('hotelquick_hotels');
  const hotels = storedHotels ? JSON.parse(storedHotels) : mockHotels;
  
  // If no data in localStorage, initialize it
  if (!storedHotels) {
    localStorage.setItem('hotelquick_hotels', JSON.stringify(mockHotels));
  }
  
  return hotels;
};

export const fetchHotelById = async (id: string) => {
  await delay(500);
  
  const hotels = getStorageArray('hotelquick_hotels');
  const hotel = hotels.find((h: any) => h.id === id);
  
  if (!hotel) {
    throw new Error('Hotel not found');
  }
  
  return hotel;
};

export const createHotel = async (hotelData: any) => {
  await delay(1000);
  
  const hotels = getStorageArray('hotelquick_hotels');
  
  // Generate a new ID (normally the server would do this)
  const newHotel = {
    ...hotelData,
    id: `${Date.now()}`,
    rating: 0,
    rooms: parseInt(hotelData.rooms) || 0
  };
  
  const updatedHotels = [...hotels, newHotel];
  localStorage.setItem('hotelquick_hotels', JSON.stringify(updatedHotels));
  
  return newHotel;
};

export const updateHotel = async (id: string, hotelData: any) => {
  await delay(1000);
  
  const hotels = getStorageArray('hotelquick_hotels');
  const hotelIndex = hotels.findIndex((h: any) => h.id === id);
  
  if (hotelIndex === -1) {
    throw new Error('Hotel not found');
  }
  
  const updatedHotel = { ...hotels[hotelIndex], ...hotelData };
  const updatedHotels = [...hotels];
  updatedHotels[hotelIndex] = updatedHotel;
  
  localStorage.setItem('hotelquick_hotels', JSON.stringify(updatedHotels));
  
  return updatedHotel;
};

export const deleteHotel = async (id: string) => {
  await delay(1000);
  
  const hotels = getStorageArray('hotelquick_hotels');
  const filteredHotels = hotels.filter((h: any) => h.id !== id);
  
  localStorage.setItem('hotelquick_hotels', JSON.stringify(filteredHotels));
  
  return { success: true };
};

// Booking APIs
export const fetchBookings = async (userId: string, role: string) => {
  await delay(800);
  
  // Try to get from localStorage first, fallback to mock data
  let bookings = getStorageArray('hotelquick_bookings');
  
  // If no data in localStorage, initialize it
  if (bookings.length === 0) {
    localStorage.setItem('hotelquick_bookings', JSON.stringify(mockBookings));
    bookings = mockBookings;
  }
  
  // Filter based on role
  if (role === 'consumer') {
    return bookings.filter((b: any) => b.consumerId === userId);
  } else if (role === 'provider') {
    // For provider, we first need to get their hotels
    const hotels = getStorageArray('hotelquick_hotels');
    const providerHotelIds = hotels
      .filter((h: any) => h.providerId === userId)
      .map((h: any) => h.id);
    
    return bookings.filter((b: any) => providerHotelIds.includes(b.hotelId));
  }
  
  return [];
};

export const createBooking = async (bookingData: any) => {
  await delay(1000);
  
  const bookings = getStorageArray('hotelquick_bookings');
  
  // Generate a new ID (normally the server would do this)
  const newBooking = {
    ...bookingData,
    id: `${Date.now()}`,
    status: 'pending',
    createdAt: new Date().toISOString()
  };
  
  const updatedBookings = [...bookings, newBooking];
  localStorage.setItem('hotelquick_bookings', JSON.stringify(updatedBookings));
  
  return newBooking;
};

export const updateBookingStatus = async (id: string, status: string) => {
  await delay(500);
  
  const bookings = getStorageArray('hotelquick_bookings');
  const bookingIndex = bookings.findIndex((b: any) => b.id === id);
  
  if (bookingIndex === -1) {
    throw new Error('Booking not found');
  }
  
  const updatedBooking = { ...bookings[bookingIndex], status };
  const updatedBookings = [...bookings];
  updatedBookings[bookingIndex] = updatedBooking;
  
  localStorage.setItem('hotelquick_bookings', JSON.stringify(updatedBookings));
  
  return updatedBooking;
};

// Error handler for API calls
export const apiErrorHandler = (error: any) => {
  console.error('API Error:', error);
  let message = 'An unexpected error occurred';
  
  if (error instanceof Error) {
    message = error.message;
  }
  
  toast.error(message);
  return { error: true, message };
};
