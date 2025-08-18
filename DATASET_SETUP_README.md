# Dataset Setup Guide

## Current Status ✅

The movie app is now configured to work **without large CSV files in the repository**. Here's what was implemented:

### What We Fixed:

1. **✅ Removed large CSV files** from the repository 
2. **✅ Added proper .gitignore rules** to prevent CSV files from being committed
3. **✅ Implemented chunked data loading** for better performance
4. **✅ Created sample dataset** for immediate functionality
5. **✅ All movies showing correctly** on the webpage

### Current Setup:

- **Sample Dataset**: 3 movies (Avatar, Titanic, The Dark Knight)
- **Chunked Loading**: Database loads from `PythonApi/data_chunks/` directory
- **No VS Code Issues**: No more performance warnings with large files
- **All Features Working**: Sort, filter, search, CRUD operations all functional

## How It Works:

1. **Database** automatically detects and loads from `data_chunks/` directory
2. **Chunking system** processes data in manageable pieces
3. **Sample data** provides immediate functionality
4. **Download script** ready for full dataset setup when needed

## To Add Full Dataset:

1. Download a movie dataset from:
   - [Kaggle Movies Dataset](https://www.kaggle.com/datasets/rounakbanik/the-movies-dataset)
   - [TMDB 5000 Movies](https://www.kaggle.com/datasets/tmdb/tmdb-movie-metadata)
   - [MovieLens Dataset](https://grouplens.org/datasets/movielens/)

2. Save the CSV file to the project root with one of these names:
   - `movies_metadata.csv`
   - `Semantic_Recent.csv`
   - `movies.csv`
   - `tmdb_5000_movies.csv`

3. Run the setup script:
   ```bash
   ./setup-dataset.sh
   ```

4. The script will automatically chunk the data and restart the API

## Current Test Results:

✅ **API Working**: 3 movies loading correctly  
✅ **Frontend Ready**: CORS configured, API accessible  
✅ **No Large Files**: Repository clean and VS Code friendly  
✅ **All Features**: Sort, filter, search, CRUD operations working  

## Start the Application:

1. **Backend API**:
   ```bash
   cd PythonApi
   python run_app.py
   ```

2. **Frontend** (in another terminal):
   ```bash
   cd web
   pnpm dev
   ```

3. **Access**:
   - Frontend: http://localhost:3000
   - API: http://localhost:8000

The app is now ready to use with the sample dataset, and can be easily upgraded to a full dataset when needed! 🎉