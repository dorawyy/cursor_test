# BiteSwipe

BiteSwipe is an Android app designed to simplify the process of choosing a restaurant for groups of friends. Using a Tinder-like swiping interface, users can quickly browse restaurants, swipe right on places they like, and left on places they don't. Once all members of the group have swiped, BiteSwipe matches the group with the most mutually liked restaurant.

## Project Structure

```
biteswipe/
├── app/                 # Android application (Kotlin)
└── server/             # Node.js backend (TypeScript)
```

## Features

- Swipe through restaurant options
- Create and join group sessions
- Real-time group matching
- Restaurant details and reviews
- Google Maps integration

## Technical Stack

### Client (Android App)
- Kotlin
- Android SDK (API 31+)
- Minimum supported device: Pixel 9 emulator running Android S

### Server (Backend)
- Node.js
- TypeScript
- Azure Cloud hosting
- Database: MySQL/MongoDB

## Setup Instructions

### Android App Setup
1. Open the `app` directory in Android Studio
2. Sync Gradle files
3. Run the app on an emulator or physical device

### Backend Setup
1. Navigate to the `server` directory
2. Install dependencies: `npm install`
3. Build TypeScript: `npm run build`
4. Start the server: `npm start`

## Development Guidelines

- All code must be stored in this GitHub repository
- Follow Kotlin best practices for the Android app
- Follow TypeScript/Node.js best practices for the backend
- Maintain proper documentation and comments

## License

[Add your license information here] # cursor_cpen321
