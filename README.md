# AImusico - Smart Music Assistant 🎵

A intelligent music assistance platform that automatically generates personalized playlists based on user schedules, events, mood, and weather conditions using Spotify APIs.

## 📋 Project Overview

AImusico is a full-stack web application that helps users discover and enjoy music tailored to their daily activities. The system intelligently combines:
- **User Schedules**: Events and tasks from the scheduler
- **Mood Preferences**: Manual mood selection
- **Weather Conditions**: Real-time weather data to influence music suggestions
- **Event Categories**: Fitness, Study, Meal, Relax, Travel

The platform automatically generates AI-powered playlists that match the user's context, making music discovery seamless and personalized.

---

## 🎯 Project Scope

### Core Features

#### 1. **User Authentication & Management**
- ✅ User registration and login
- ✅ JWT-based session management
- ✅ Password encryption with bcrypt
- ✅ User profile management

#### 2. **Event/Schedule Management**
- ✅ Interactive calendar interface (FullCalendar)
- ✅ Create, Read, Update, Delete events
- ✅ Event categories: Fitness, Study, Meal, Relax, Travel
- ✅ Repeat options: None, Daily, Weekly, Monthly
- ✅ Full-day and timed events
- ✅ Event descriptions and metadata

#### 3. **Spotify Integration**
- ✅ Spotify Web API integration
- ✅ OAuth token management (Client Credentials flow)
- ✅ Search playlists by mood/keyword
- ✅ Search tracks by mood
- ✅ Get detailed playlist information
- ✅ Mood-to-keyword mapping system

#### 4. **Weather Integration**
- ✅ OpenWeatherMap API integration
- ✅ Geolocation-based weather fetching
- ✅ Display current weather on dashboard
- ⚠️ **TODO**: Integrate weather data into playlist generation logic

#### 5. **Playlist Generation**
- ✅ Manual mood-based playlist browsing
- ⚠️ **TODO**: Automatic playlist generation from upcoming events
- ⚠️ **TODO**: AI-powered playlist curation
- ⚠️ **TODO**: Weather-influenced music suggestions

---

## 🏗️ Architecture

### Backend Structure
```
backend/
├── index.js                 # Server entry point
├── src/
│   ├── app.js              # Express app configuration
│   ├── config/
│   │   ├── db.js           # MongoDB connection
│   │   └── spotifyConfig.js # Spotify API configuration
│   ├── models/
│   │   ├── userModel.js    # User schema
│   │   └── eventModel.js   # Event schema
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── eventController.js
│   │   └── SpotifyController.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── eventRoutes.js
│   │   └── SpotifyRoutes.js
│   └── Component/
│       ├── Spotify.js      # Main Spotify logic
│       └── spotify/
│           ├── Token.js    # Token management
│           ├── Playlist.js # Playlist operations
│           └── Tracks.js   # Track operations
```

### Frontend Structure
```
frontend/
├── src/
│   ├── App.js              # Main app component
│   ├── routes/
│   │   └── AppRoutes.js    # Route configuration
│   ├── pages/
│   │   ├── Home.js         # Dashboard
│   │   ├── Scheduler.js    # Calendar & events
│   │   ├── Playlist.js     # Playlist browser
│   │   ├── Login.js        # Login page
│   │   ├── Signup.js       # Registration page
│   │   └── Components/
│   │       ├── moodFilter.js
│   │       └── playlistCard.js
│   ├── api/
│   │   ├── authApi.js      # Auth API calls
│   │   └── eventApi.js     # Event API calls
│   └── css/                # Styling files
```

---

## 🛠️ Technology Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js 5.1.0
- **Database**: MongoDB with Mongoose 8.19.0
- **Authentication**: JWT (jsonwebtoken 9.0.2), bcryptjs 3.0.2
- **Spotify SDK**: spotify-web-api-node 5.0.2
- **Environment**: dotenv 17.2.3

### Frontend
- **Framework**: React 19.2.0
- **Routing**: React Router DOM 7.9.4
- **UI Library**: Bootstrap 5.3.8, React Bootstrap 2.10.10
- **Calendar**: FullCalendar React 6.1.19
- **HTTP Client**: Axios 1.12.2
- **Notifications**: SweetAlert2 11.26.3

### External APIs
- **Spotify Web API**: Music data and playlists
- **OpenWeatherMap API**: Weather information

---

## 📡 API Endpoints

### Authentication
- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login

### Events
- `POST /api/event` - Create new event
- `GET /api/event` - Get all events (needs userId filter)
- `GET /api/event/:eventId` - Get specific event
- `PUT /api/event/:eventId` - Update event
- `DELETE /api/event/:eventId` - Delete event

### Spotify
- `GET /api/spotify/playlist?mood={mood}` - Get playlists by mood
- `GET /api/spotify/tracks?mood={mood}` - Get tracks by mood
- `GET /api/spotify/playlist/:id` - Get single playlist details

---

## 🗄️ Database Schema

### User Collection
```javascript
{
  _id: ObjectId,
  name: String (required),
  email: String (required, unique),
  password: String (hashed, required),
  role: String (enum: ["user", "admin"], default: "user"),
  createdAt: Date
}
```

### Event Collection
```javascript
{
  _id: ObjectId,
  userId: String (required),
  title: String (required),
  description: String,
  date: Date (required),
  startTime: String (format: "HH:MM"),
  endTime: String (format: "HH:MM"),
  fullDay: Boolean (default: false),
  category: String (enum: ["Fitness", "Study", "Meal", "Relax", "Travel"]),
  repeat: String (enum: ["None", "Daily", "Weekly", "Monthly", "Custom"]),
  repeatDays: [String],
  createdAt: Date,
  completedAt: Date
}
```

---

## 🎨 Mood Mapping System

Current mood-to-keyword mapping:
- **morning** → "energetic"
- **study** → "focus"
- **workout** → "pump"
- **relax** → "lofi chill"
- **night** → "chill"

---

## 🚀 Future Enhancements (Planned Features)

### 1. **AI-Powered Playlist Generation**
- [ ] Integrate AI/ML service for intelligent music curation
- [ ] Analyze user listening history and preferences
- [ ] Generate context-aware playlists
- [ ] Learn from user feedback and interactions

### 2. **Automatic Event-Based Playlists**
- [ ] Monitor upcoming events from scheduler
- [ ] Auto-generate playlists based on event category and time
- [ ] Map event categories to appropriate moods:
  - Fitness → workout/energetic
  - Study → focus/ambient
  - Meal → chill/background
  - Relax → lofi/calm
  - Travel → upbeat/adventure
- [ ] Send notifications when playlists are ready

### 3. **Weather-Enhanced Suggestions**
- [ ] Integrate weather data into playlist generation
- [ ] Weather-to-mood mapping:
  - Sunny → upbeat, energetic
  - Rainy → cozy, chill
  - Cold → warm, comforting
  - Hot → refreshing, cool
- [ ] Combine weather with event context for better suggestions

### 4. **Smart Playlist Features**
- [ ] Playlist duration matching event duration
- [ ] BPM matching for fitness activities
- [ ] Energy level adjustment based on time of day
- [ ] Genre preferences per user
- [ ] Collaborative playlists

### 5. **User Experience Enhancements**
- [ ] Playlist preview and playback
- [ ] Save favorite playlists
- [ ] Playlist history
- [ ] Share playlists with friends
- [ ] Playlist recommendations based on past events

### 6. **Backend Improvements**
- [ ] Fix event filtering by userId
- [ ] Add playlist caching
- [ ] Implement rate limiting
- [ ] Add error handling middleware
- [ ] Create playlist generation service
- [ ] Add scheduled jobs for auto-playlist generation

### 7. **Frontend Improvements**
- [ ] Fix playlist response structure mismatch
- [ ] Add loading states and error handling
- [ ] Improve UI/UX design
- [ ] Add playlist player component
- [ ] Show upcoming events on dashboard
- [ ] Display auto-generated playlists for today's events

---

## 🐛 Known Issues

1. **Event Filtering**: `getEventsByUser` doesn't filter by userId - returns all events
2. **Response Mismatch**: Playlist endpoint returns `playlists` but frontend expects `tracks`
3. **Weather Integration**: Weather data is fetched but not used in playlist generation
4. **Syntax Error**: Missing closing brace in `Spotify.js` (line 19)
5. **Route Mismatch**: Frontend calls `/api/event/${userId}` but backend expects `/api/event/:eventId`

---

## 📝 Development Guidelines

### Code Style
- Use ES6 modules (import/export)
- Follow async/await pattern
- Use meaningful variable names
- Add comments for complex logic

### Git Workflow
- Feature branches for new features
- Descriptive commit messages
- Code review before merging

### Environment Variables
Required `.env` file in backend:
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/aimusico
JWT_SECRET=your_jwt_secret_key
SPOTIFY_CLIENT_ID=your_spotify_client_id
SPOTIFY_CLIENT_SECRET=your_spotify_client_secret
```

---

## 🎯 Project Goals

1. **Primary Goal**: Create an intelligent music assistant that understands user context
2. **User Experience**: Seamless, automatic playlist generation without manual intervention
3. **Intelligence**: Combine multiple data sources (schedule, weather, mood) for better suggestions
4. **Scalability**: Architecture that can support future AI/ML enhancements
5. **Reliability**: Robust error handling and user feedback

---

## 📚 Documentation

- [Schema Documentation](./documentation/schema.md)
- [API Documentation](./documentation/api.md) (to be created)
- [Setup Guide](./documentation/setup.md) (to be created)

---

## 👥 Contributing

This is a working project. Before making changes:
1. Review this README for project scope
2. Check existing issues and planned features
3. Follow the architecture patterns established
4. Test thoroughly before committing
5. Update documentation as needed

---

## 📄 License

[To be determined]

---

## 🔄 Project Status

**Current Phase**: Development - Core features implemented, AI integration pending

**Last Updated**: [Current Date]

**Next Milestones**:
1. Fix identified bugs
2. Integrate weather into playlist generation
3. Implement automatic event-based playlist generation
4. Add AI/ML service for intelligent curation

---

*This README serves as the primary reference document for the AImusico project scope and development guidelines.*
