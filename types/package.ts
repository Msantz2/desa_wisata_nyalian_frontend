export interface TourPackage {
  id: string;
  slug: string;
  name: string;
  category: string;
  shortDescription: string;
  description: string;
  thumbnail: string;
  gallery: string[];
  price: number | string;
  duration: string;
  capacity: string;
  highlights: string[];
  itinerary: string[];
  included: string[];
  excluded: string[];
  destinations: string[];
  rating: number;
  featured: boolean;
  totalReviews?: number;
  quickInfo?: {
    groupCapacity?: string;
    languages?: string[];
    transportation?: boolean;
    availability?: string;
    physicalLevel?: string;
    suitableFor?: string[];
  };
  terms?: string[];
  relatedPackages?: string[];
}
