# Movie Collection App

A full-stack movie management application with **Next.js 15**, **FastAPI**, and **CSV-based data storage**. Search, filter, rate, and organize your favorite movies.

![Next.js](https://img.shields.io/badge/Next.js-15.x-black?logo=next.js)
![React](https://img.shields.io/badge/React-19.x-blue?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?logo=typescript)
![FastAPI](https://img.shields.io/badge/FastAPI-Latest-green?logo=fastapi)
![Python](https://img.shields.io/badge/Python-3.11+-blue?logo=python)

## ✨ Features

### 🎬 **Movie Management**
- **4,808 movies** loaded from comprehensive CSV database
- **CRUD operations** with real-time updates
- **Advanced search** across titles, cast, crew, and descriptions
- **Smart filtering** by genre, year, rating, runtime, and language
- **Personal ratings** and notes system

### 🔍 **Search & Discovery**
- **Debounced search** with instant results
- **Multi-criteria filtering** with URL synchronization
- **Pagination** for efficient browsing
- **Sorting** by title, year, rating, or popularity

### ⭐ **User Experience**
- **Light/Dark mode** with system preference detection
- **Smooth animations** and micro-interactions
- **Favorites system** with localStorage persistence
- **Responsive design** for all device sizes
- **Loading states** and error handling
- **Type-safe** throughout with TypeScript

## 🚀 Quick Start

### Prerequisites
- **Node.js** 18+ and **pnpm**
- **Python** 3.11+ with **pip**

### Setup & Run

1. **Clone and navigate**
   ```bash
   git clone <repository-url>
   cd movies1
   ```

2. **Setup the movie dataset**
   ```bash
   ./setup-dataset.sh
   ```
   > 📋 **Note**: The movie dataset (Semantic_Recent.csv) is not included in the repository. Follow the script instructions to obtain and set up the dataset manually.

3. **Start the API** (Terminal 1)
   ```bash
   cd PythonApi
   pip install -r requirements.txt
   python run_app.py
   ```

4. **Start the frontend** (Terminal 2)
   ```bash
   cd web
   pnpm install
   pnpm dev
   ```

5. **Access the application**
   - **Frontend**: http://localhost:3000
   - **API Documentation**: http://localhost:8000/swagger

## 🏗️ Architecture

### Backend (FastAPI)
- **CSV Database**: 4,808 movies from `Semantic_Recent.csv`
- **Chunked loading** prevents memory issues and timeouts
- **RESTful API** with comprehensive filtering and pagination
- **Auto-generated OpenAPI** documentation

### Frontend (Next.js)
- **App Router** with Server Components
- **Theme system** with light/dark/system modes
- **Animated UI** with custom CSS animations and transitions
- **RTK Query** for API state management
- **Redux Toolkit** for local state (favorites)
- **Zod validation** with React Hook Form
- **Shadcn/ui** components with Tailwind CSS

## 📊 API Endpoints

- `GET /api/Movies` - Paginated movies with filtering
- `GET /api/Movies/search` - Text search across all fields
- `GET /api/Movies/favorites` - User's favorite movies
- `GET /api/Movies/{id}` - Individual movie details
- `PUT /api/Movies/{id}` - Update movie (ratings, notes)
- `POST /api/Movies/{id}/favorite` - Toggle favorite status
- `GET /api/stats` - Database statistics

## 📁 Project Structure

```
movies1/
├── PythonApi/              # FastAPI backend
│   ├── main.py            # API endpoints
│   ├── models.py          # Pydantic models
│   ├── database.py        # CSV data layer
│   └── requirements.txt   # Dependencies
├── web/                   # Next.js frontend
│   ├── src/app/          # App Router pages
│   ├── src/components/   # UI components (enhanced with animations)
│   ├── src/contexts/     # Theme context for light/dark mode
│   ├── src/store/        # Redux + RTK Query
│   └── package.json      # Dependencies
├── setup-dataset.sh       # Dataset setup script
└── README.md             # This file
```

## 🎯 Key Features Implemented

✅ **Full-text search** across movies database  
✅ **Advanced filtering** with 12+ filter criteria  
✅ **Real-time pagination** with configurable page sizes  
✅ **Light/Dark theme** with system preference detection  
✅ **Smooth animations** and micro-interactions  
✅ **Favorites management** with local persistence  
✅ **Personal ratings** and notes system  
✅ **Responsive UI** with loading states and error handling  
✅ **Type-safe** API integration with auto-generated client  
✅ **URL synchronization** for shareable search results  
✅ **Dataset management** with setup script  

## 🔧 Development

### Backend Commands
```bash
cd PythonApi
python run_app.py              # Start server
python generate_api_specification.py  # Update OpenAPI spec
pytest tests/                  # Run tests
```

### Frontend Commands
```bash
cd web
pnpm dev                       # Start dev server
pnpm build                     # Build for production
pnpm lint                      # Lint code
pnpm generate-api              # Update API client
```

## ⚠️ Current Limitations

This is a **CSV-based proof of concept** with these constraints:
- **In-memory storage**: Changes don't persist to CSV
- **Single user**: No authentication or multi-user support
- **Performance**: Large dataset may cause slower initial load
- **Concurrency**: No concurrent user support

## 🚀 Production Recommendations

For production deployment, consider:
- **Database**: PostgreSQL or MongoDB for persistence
- **Caching**: Redis for improved performance
- **Authentication**: User accounts and personalized collections
- **File Storage**: Cloud storage for movie assets
- **Real-time**: WebSocket support for live updates

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

---

**Built with modern web technologies for efficient movie collection management**