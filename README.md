# Movie Collection App

A powerful, full-stack movie collection application built with **Next.js 15**, **FastAPI**, and **CSV-based data storage**. Discover, organize, rate, and manage your favorite movies with a modern, responsive interface.

![Next.js](https://img.shields.io/badge/Next.js-15.x-black?logo=next.js)
![React](https://img.shields.io/badge/React-19.x-blue?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?logo=typescript)
![FastAPI](https://img.shields.io/badge/FastAPI-Latest-green?logo=fastapi)
![Python](https://img.shields.io/badge/Python-3.11+-blue?logo=python)

## ✨ Features

### 🔍 **Search & Discovery**
- **Debounced search** with real-time filtering
- **Advanced filters**: Genre, year range, rating range, runtime
- **Smart sorting** by title, year, rating, or popularity
- **URL synchronization** for shareable filtered views

### 📱 **Modern UI/UX**
- **Responsive design** that works on all devices
- **Loading skeletons** and **empty states** for better UX
- **Error boundaries** with retry functionality
- **Toast notifications** for user feedback
- **Grid/List view** toggle for flexible browsing

### ⭐ **Movie Management**
- **CRUD operations** with optimistic updates
- **Personal ratings** (1-10 scale) and notes
- **Favorites system** with localStorage persistence
- **Detailed movie pages** with comprehensive information
- **Form validation** using Zod schemas

### 🚀 **Performance**
- **Pagination** with configurable page sizes
- **Efficient re-renders** using React optimizations
- **Client-side caching** via RTK Query
- **Chunked CSV loading** to prevent timeouts

### 🎯 **Developer Experience**
- **Type-safe** throughout with TypeScript
- **Auto-generated API client** from OpenAPI specs
- **Redux Toolkit** for predictable state management
- **Comprehensive error handling** and validation

## 🏗️ Architecture

### Backend (FastAPI)
- **CQRS pattern** with MediatR-style handlers
- **Pydantic models** for data validation
- **CSV-based storage** with efficient loading
- **OpenAPI documentation** auto-generation
- **Comprehensive filtering and pagination**

### Frontend (Next.js)
- **App Router** with Server Components
- **RTK Query** for API state management
- **Redux Toolkit** for local state
- **Shadcn/ui** components with Tailwind CSS
- **React Hook Form** with Zod validation

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18+ and **pnpm** 9+
- **Python** 3.11+ with **pip**
- **Git** for version control

### Environment Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd movies1
   ```

2. **Backend Setup (FastAPI)**
   ```bash
   cd PythonApi
   
   # Create virtual environment
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   
   # Install dependencies
   pip install -r requirements.txt
   
   # Start the API server
   uvicorn main:app --reload --port 8000
   ```

3. **Frontend Setup (Next.js)**
   ```bash
   cd web
   
   # Install dependencies
   pnpm install
   
   # Generate API client from OpenAPI spec
   pnpm generate-api
   
   # Start development server
   pnpm dev
   ```

### Development Commands

#### Backend (FastAPI)
```bash
# Start server with auto-reload
uvicorn main:app --reload --port 8000

# View API documentation
# Navigate to http://localhost:8000/docs

# Run tests
pytest tests/ -v

# Format code
black . && isort .

# Type checking
mypy .
```

#### Frontend (Next.js)
```bash
# Development server
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start

# Lint code
pnpm lint

# Regenerate API client
pnpm generate-api

# Type checking
pnpm type-check
```

## 📊 Data Source

This application uses the **Semantic_Recent.csv** file as its database, which contains:
- **4,800+ movies** with comprehensive metadata
- **1,275 columns** including cast, crew, genres, keywords
- **Production details**, ratings, and release information

### CSV Structure
The CSV includes fields like:
- Basic info: `title`, `overview`, `release_date`, `runtime`
- Ratings: `vote_average`, `vote_count`, `popularity`
- People: `cast`, `crew` (JSON arrays)
- Categories: `genres`, `keywords` (JSON arrays)
- Production: `production_companies`, `production_countries`

## 🔧 Configuration

### Environment Variables

Create `.env.local` in the `web` directory:
```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:8000

# Optional: Analytics
NEXT_PUBLIC_GA_ID=your-ga-id
```

### API Configuration

The FastAPI backend auto-configures from the CSV file location. Key settings:

- **Chunk size**: 200 rows for optimal loading performance
- **Pagination**: Default 20 items per page (configurable 10-100)
- **Search**: Full-text search across title, overview, cast, crew
- **Timeout handling**: Lazy loading prevents startup timeouts

## 📁 Project Structure

```
movies1/
├── PythonApi/               # FastAPI backend
│   ├── main.py             # API entry point
│   ├── models.py           # Pydantic models
│   ├── database.py         # CSV data access layer
│   ├── requirements.txt    # Python dependencies
│   └── tests/              # Backend tests
├── web/                    # Next.js frontend
│   ├── src/
│   │   ├── app/            # App Router pages
│   │   ├── components/     # Reusable UI components
│   │   ├── store/          # Redux store and API
│   │   ├── hooks/          # Custom React hooks
│   │   └── lib/            # Utilities and validations
│   ├── package.json        # Frontend dependencies
│   └── openapi-config.ts   # API generation config
├── Semantic_Recent.csv     # Movie database (CSV)
└── README.md              # This file
```

## 🧪 Testing

### Running Tests

```bash
# Backend tests
cd PythonApi
pytest tests/ -v --cov=.

# Frontend tests (when implemented)
cd web
pnpm test
pnpm test:coverage
```

### Test Coverage

The application includes tests for:
- **API endpoints** (CRUD operations, filtering, pagination)
- **Data validation** (Pydantic models, edge cases)
- **CSV loading** (chunked processing, error handling)
- **Search functionality** (text search, filters)

## 🚀 Deployment

### Production Build

```bash
# Backend
cd PythonApi
pip install -r requirements.txt
uvicorn main:app --host 0.0.0.0 --port 8000

# Frontend
cd web
pnpm build
pnpm start
```

### Docker Deployment

```dockerfile
# Backend Dockerfile
FROM python:3.11-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]

# Frontend Dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm && pnpm install
COPY . .
RUN pnpm build
CMD ["pnpm", "start"]
```

## ⚠️ Limitations & Considerations

### CSV-Based POC Limitations

This is a **Proof of Concept** using CSV storage with inherent limitations:

1. **Data Persistence**: Movie updates persist only in memory during runtime
2. **Concurrency**: No concurrent user support (single-instance)
3. **Performance**: Large CSV files may cause initial loading delays
4. **Scalability**: Not suitable for production with multiple users
5. **Data Integrity**: No ACID transactions or referential integrity

### Production Recommendations

For production deployment, consider migrating to:
- **Database**: PostgreSQL, MongoDB, or SQLite for data persistence
- **Caching**: Redis for improved performance
- **File Storage**: Cloud storage for movie posters/metadata
- **Authentication**: User management and personalized collections
- **Real-time**: WebSocket support for live updates

## 🤝 Contributing

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

### Development Guidelines

- Follow **TypeScript** best practices
- Use **conventional commits** for clear history
- Add **tests** for new functionality
- Update **documentation** for API changes
- Ensure **type safety** throughout

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **TMDB** for movie data and inspiration
- **Shadcn/ui** for beautiful UI components
- **FastAPI** for excellent API development experience
- **Next.js** for powerful React framework
- **Redux Toolkit** for predictable state management

---

**Built with ❤️ using modern web technologies**