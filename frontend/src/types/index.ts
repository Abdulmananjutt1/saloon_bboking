export interface Service {
  id: string;
  name: string;
  category: ServiceCategory;
  description: string;
  duration: number; // minutes
  price: number;
  discountedPrice?: number;
  image: string;
  popular?: boolean;
  forGender: "male" | "female" | "unisex";
}

export interface Stylist {
  id: string;
  name: string;
  role: string;
  avatar: string;
  rating: number;
  reviewCount: number;
  experience: number; // years
  specialties: string[];
  bio: string;
  available: boolean;
  slots: string[];
}

export interface Booking {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  serviceId: string;
  serviceName: string;
  stylistId: string;
  stylistName: string;
  date: string;
  time: string;
  duration: number;
  price: number;
  status: BookingStatus;
  notes?: string;
  createdAt: string;
}

export interface Review {
  id: string;
  customerName: string;
  avatar?: string;
  rating: number;
  comment: string;
  service: string;
  date: string;
}

export interface GalleryImage {
  id: string;
  src: string;
  category: "haircut" | "beard" | "color" | "facial" | "bridal" | "nails";
  caption?: string;
}

export interface Product {
  id: string;
  name: string;
  brand: string;
  price: number;
  image: string;
  category: string;
  description: string;
}

export type ServiceCategory =
  | "haircut"
  | "beard"
  | "color"
  | "facial"
  | "massage"
  | "nails"
  | "bridal"
  | "waxing"
  | "keratin";

export type BookingStatus = "pending" | "confirmed" | "completed" | "cancelled";
