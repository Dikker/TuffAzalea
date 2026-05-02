export interface UserContribution {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  imageUrl: string;
  description: string;
  category: 'illegal-dumping' | 'missed-collection' | 'hazardous' | 'other';
  location: {
    lat: number;
    lng: number;
    address?: string;
  };
  createdAt: number;
  status: 'pending' | 'in-progress' | 'resolved' | 'verified';
}

export interface UserProfile {
  uid: string;
  displayName: string;
  email: string;
  photoURL?: string;
  points: number;
  level: number;
  contributions: number;
  achievements: Achievement[];
  role: 'user' | 'admin';
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt?: number;
}

export interface NewsItem {
  id: string;
  title: string;
  summary: string;
  url: string;
  date: string;
  source: string;
}
