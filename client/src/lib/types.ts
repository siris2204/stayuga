export type PropertyType = "villa" | "farmhouse";
export type PropertyStatus = "draft" | "published";
export type BookingStatus = "pending" | "confirmed" | "declined";
export type LeadStatus = "new" | "contacted" | "closed";
export type ExperienceType = "event" | "retreat";

export interface Property {
  _id: string;
  title: string;
  slug: string;
  type: PropertyType;
  tagline?: string;
  description: string;
  images: string[];
  amenities: string[];
  location: {
    address: string;
    city: string;
    state: string;
    mapEmbedUrl?: string;
  };
  pricing: {
    basePrice: number;
    weekendPrice?: number;
    currency: string;
  };
  capacity: {
    maxGuests: number;
    bedrooms: number;
    bathrooms: number;
  };
  blockedDates?: { startDate: string; endDate: string; reason?: string }[];
  featured: boolean;
  status: PropertyStatus;
  createdAt: string;
  updatedAt: string;
}

export interface Booking {
  _id: string;
  property: { _id: string; title: string; slug: string } | string;
  name: string;
  email: string;
  phone: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  message?: string;
  status: BookingStatus;
  createdAt: string;
}

export interface Lead {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
  status: LeadStatus;
  createdAt: string;
}

export interface Experience {
  _id: string;
  title: string;
  slug: string;
  type: ExperienceType;
  description: string;
  images: string[];
  location?: string;
  scheduleNote?: string;
  featured: boolean;
  createdAt: string;
}

export interface FaqItem {
  _id: string;
  question: string;
  answer: string;
  order: number;
}

export interface PolicyPage {
  _id: string;
  slug: string;
  title: string;
  content: string;
}

export interface HomepageHero {
  heading: string;
  subheading: string;
}

export interface AboutMission {
  heading: string;
  body: string;
}

export interface ContentBlocks {
  "homepage-hero"?: HomepageHero;
  "about-mission"?: AboutMission;
}
