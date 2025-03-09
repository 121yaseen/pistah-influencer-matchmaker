import {NavigatorScreenParams} from '@react-navigation/native';
import {StackScreenProps} from '@react-navigation/stack';
import {Campaign} from '../types';

export type RootStackParamList = {
  Auth: NavigatorScreenParams<AuthStackParamList>;
  Main: NavigatorScreenParams<MainTabParamList>;
};

export type AuthStackParamList = {
  Welcome: undefined;
  Login: undefined;
  Register: {
    userType: 'influencer' | 'company';
  };
  InstagramAuth: undefined;
};

export type MainTabParamList = {
  Discover: undefined;
  Matches: undefined;
  Messages: undefined;
  Profile: undefined;
};

export type DiscoverStackParamList = {
  DiscoverFeed: undefined;
  CampaignDetails: {
    campaign: Campaign;
  };
  InfluencerProfile: {
    influencerId: string;
  };
  CompanyProfile: {
    companyId: string;
  };
};

export type MatchesStackParamList = {
  MatchesList: undefined;
  MatchDetails: {
    matchId: string;
  };
};

export type MessagesStackParamList = {
  ChatList: undefined;
  ChatRoom: {
    matchId: string;
    recipientId: string;
  };
};

export type ProfileStackParamList = {
  ProfileOverview: undefined;
  EditProfile: undefined;
  Settings: undefined;
  CampaignManagement: undefined;
};

export type MainStackParamList = {
  Welcome: undefined;
  InstagramAuth: undefined;
  Main: undefined;
  Discover: undefined;
  Matches: undefined;
  Messages: undefined;
  Profile: undefined;
  Chat: {
    matchId: string;
    otherUserName: string;
  };
};

// Helper types for screen props
export type AuthScreenProps<T extends keyof AuthStackParamList> =
  StackScreenProps<AuthStackParamList, T>;

export type DiscoverScreenProps<T extends keyof DiscoverStackParamList> =
  StackScreenProps<DiscoverStackParamList, T>;

export type MatchesScreenProps<T extends keyof MatchesStackParamList> =
  StackScreenProps<MatchesStackParamList, T>;

export type MessagesScreenProps<T extends keyof MessagesStackParamList> =
  StackScreenProps<MessagesStackParamList, T>;

export type ProfileScreenProps<T extends keyof ProfileStackParamList> =
  StackScreenProps<ProfileStackParamList, T>;
