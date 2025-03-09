# InfluencerMatchMaker

A cross-platform mobile app that matches influencers with companies seeking product promotions, inspired by Bumble's swipe and match interface.

## Features

- **Authentication**
  - Email/Phone and Instagram OAuth integration
  - Separate flows for influencers and companies
  - Secure JWT-based authentication

- **Influencer Features**
  - Instagram profile integration
  - Analytics display (followers, engagement rate)
  - Campaign discovery and matching
  - In-app messaging with companies

- **Company Features**
  - Company profile management
  - Campaign creation and management
  - Influencer discovery and matching
  - In-app messaging with influencers

- **Core Features**
  - Swipe-based matching system
  - Real-time chat
  - Push notifications
  - Profile management
  - Advanced search and filters

## Tech Stack

- React Native
- TypeScript
- Firebase (Authentication, Firestore, Storage)
- Instagram Graph API
- React Navigation
- React Native Reanimated

## Getting Started

### Prerequisites

- Node.js >= 14
- Yarn or npm
- iOS: XCode (Mac only)
- Android: Android Studio
- React Native CLI

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/influencer-product-match-maker.git
cd influencer-product-match-maker
```

2. Install dependencies:
```bash
yarn install
```

3. Install iOS dependencies (Mac only):
```bash
cd ios && pod install && cd ..
```

4. Create a Firebase project and add your configuration to `src/config/firebase.ts`

5. Set up Instagram API credentials in `src/config/instagram.ts`

### Running the App

#### iOS (Mac only)
```bash
yarn ios
```

#### Android
```bash
yarn android
```

## Project Structure

```
src/
├── assets/         # Images, fonts, etc.
├── components/     # Reusable components
├── config/         # Configuration files
├── contexts/       # React Context providers
├── hooks/          # Custom React hooks
├── navigation/     # Navigation configuration
├── screens/        # Screen components
├── services/       # API and third-party services
├── store/         # State management
├── types/         # TypeScript type definitions
└── utils/         # Utility functions
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details. 