export interface InstagramStats {
  followers: number;
  engagementRate: number;
  recentPosts: InstagramPost[];
}

export interface InstagramPost {
  id: string;
  type: 'POST' | 'REEL';
  mediaUrl: string;
  caption: string;
  likes: number;
  comments: number;
  timestamp: Date;
}

export interface UserBase {
  id: string;
  email: string;
  name: string;
  profilePicture?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface InfluencerProfile extends UserBase {
  type: 'influencer';
  instagramHandle: string;
  instagramStats: InstagramStats;
  bio: string;
  niches: string[];
  location: string;
  demographics: {
    age: string;
    gender: string;
    primaryAudience: string[];
  };
}

export interface CompanyProfile extends UserBase {
  type: 'company';
  companyName: string;
  industry: string;
  description: string;
  website: string;
  campaigns: Campaign[];
}

export interface Campaign {
  id: string;
  title: string;
  description: string;
  requirements: {
    minFollowers: number;
    minEngagementRate: number;
    preferredNiches: string[];
    preferredDemographics?: {
      age?: string[];
      gender?: string[];
      location?: string[];
    };
  };
  budget: {
    min: number;
    max: number;
    currency: string;
  };
  status: 'active' | 'paused' | 'completed';
  startDate: Date;
  endDate?: Date;
}

export interface Match {
  id: string;
  influencerId: string;
  companyId: string;
  campaignId: string;
  status: 'pending' | 'accepted' | 'rejected' | 'completed';
  createdAt: Date;
  updatedAt: Date;
}

export interface Message {
  id: string;
  matchId: string;
  senderId: string;
  content: string;
  type: 'text' | 'image' | 'document';
  timestamp: Date;
  read: boolean;
}

export interface SwipeAction {
  userId: string;
  targetId: string;
  type: 'like' | 'dislike';
  timestamp: Date;
}
