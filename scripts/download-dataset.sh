#!/bin/bash

echo "🎬 Movie Dataset Download Script"
echo "================================"

CHUNKS_DIR="PythonApi/data_chunks"

# Check if we're in the right directory
if [ ! -f "CLAUDE.md" ]; then
    echo "❌ Please run this script from the root of the movies project"
    exit 1
fi

# Check for existing dataset
if [ -d "$CHUNKS_DIR" ] && [ "$(ls -A $CHUNKS_DIR 2>/dev/null)" ]; then
    echo "⚠️ Dataset chunks already exist in $CHUNKS_DIR"
    echo "Do you want to re-download and recreate the dataset? [y/N]"
    read -r response
    if [[ ! "$response" =~ ^[Yy]$ ]]; then
        echo "ℹ️ Using existing dataset"
        exit 0
    fi
    rm -rf "$CHUNKS_DIR"
fi

echo "ℹ️ Setting up dataset directory..."
mkdir -p "$CHUNKS_DIR"

# Look for local movie dataset files
LOCAL_FILES=(
    "movies_metadata.csv"
    "Semantic_Recent.csv"
    "movies.csv"
    "tmdb_5000_movies.csv"
)

FOUND_FILE=""
for file in "${LOCAL_FILES[@]}"; do
    if [ -f "$file" ]; then
        FOUND_FILE="$file"
        break
    fi
done

if [ -n "$FOUND_FILE" ]; then
    echo "✅ Found local dataset: $FOUND_FILE"
    echo "ℹ️ Processing and chunking dataset..."
    
    # Run chunking script
    cd PythonApi
    python3 chunk_csv.py "../$FOUND_FILE"
    cd ..
    
    echo "✅ Dataset ready! Created chunks in $CHUNKS_DIR"
    
else
    echo "⚠️ No local dataset found"
    echo ""
    echo "📋 To set up the movie dataset:"
    echo ""
    echo "1. Download a movie dataset from one of these sources:"
    echo "   • Kaggle Movies Dataset: https://www.kaggle.com/datasets/rounakbanik/the-movies-dataset"
    echo "   • TMDB 5000 Movies: https://www.kaggle.com/datasets/tmdb/tmdb-movie-metadata"
    echo "   • MovieLens Dataset: https://grouplens.org/datasets/movielens/"
    echo ""
    echo "2. Save the CSV file to this directory with one of these names:"
    for file in "${LOCAL_FILES[@]}"; do
        echo "   • $file"
    done
    echo ""
    echo "3. Run this script again to process and chunk the dataset"
    echo ""
    echo "⚠️ Creating sample dataset for now..."
    
    # Create a small sample dataset for immediate functionality
    cat > "$CHUNKS_DIR/movies_chunk_001.csv" << 'EOF'
title_y,overview,genres,keywords,tagline,cast,crew,production_companies,production_countries,spoken_languages,original_language,original_title,release_date,runtime,vote_average,vote_count,popularity
Avatar,"In the 22nd century, a paraplegic Marine is dispatched to the moon Pandora on a unique mission, but becomes torn between following orders and protecting an alien civilization.","[{""id"": 28, ""name"": ""Action""}, {""id"": 12, ""name"": ""Adventure""}, {""id"": 14, ""name"": ""Fantasy""}, {""id"": 878, ""name"": ""Science Fiction""}]","[{""id"": 1463, ""name"": ""culture clash""}, {""id"": 2964, ""name"": ""future""}]","Enter the World of Pandora.","[{""cast_id"": 242, ""character"": ""Jake Sully"", ""name"": ""Sam Worthington""}]","[{""job"": ""Director"", ""name"": ""James Cameron""}]","[{""name"": ""Ingenious Film Partners""}]","[{""name"": ""United States of America""}]","[{""name"": ""English""}]",en,Avatar,2009-12-10,162,7.2,11800,150.437577
Titanic,"101-year-old Rose DeWitt Bukater tells the story of her life aboard the Titanic, 84 years later.","[{""id"": 18, ""name"": ""Drama""}, {""id"": 10749, ""name"": ""Romance""}]","[{""id"": 852, ""name"": ""ship""}, {""id"": 6054, ""name"": ""ocean""}]","Nothing on Earth could come between them.","[{""cast_id"": 1, ""character"": ""Jack Dawson"", ""name"": ""Leonardo DiCaprio""}]","[{""job"": ""Director"", ""name"": ""James Cameron""}]","[{""name"": ""Paramount""}]","[{""name"": ""United States of America""}]","[{""name"": ""English""}]",en,Titanic,1997-11-18,194,7.8,14701,89.948895
The Dark Knight,"Batman raises the stakes in his war on crime. With the help of Lt. Jim Gordon and District Attorney Harvey Dent, Batman sets out to dismantle the remaining criminal organizations that plague the streets.","[{""id"": 18, ""name"": ""Drama""}, {""id"": 28, ""name"": ""Action""}, {""id"": 80, ""name"": ""Crime""}, {""id"": 53, ""name"": ""Thriller""}]","[{""id"": 849, ""name"": ""dc comics""}, {""id"": 853, ""name"": ""based on comic""}]","Why So Serious?","[{""cast_id"": 2, ""character"": ""Bruce Wayne / Batman"", ""name"": ""Christian Bale""}]","[{""job"": ""Director"", ""name"": ""Christopher Nolan""}]","[{""name"": ""Warner Bros.""}]","[{""name"": ""United States of America""}]","[{""name"": ""English""}]",en,The Dark Knight,2008-07-16,152,8.3,12269,187.323906
EOF

    # Create metadata
    cat > "$CHUNKS_DIR/metadata.json" << 'EOF'
{
  "original_file": "sample_dataset",
  "total_chunks": 1,
  "total_rows": 3,
  "chunk_size": 1000,
  "chunk_pattern": "movies_chunk_*.csv",
  "note": "This is a sample dataset. Download a full dataset for complete functionality."
}
EOF

    echo "✅ Sample dataset created with 3 movies"
    echo "⚠️ For full functionality, download a complete movie dataset"
fi

echo ""
echo "✅ Dataset setup complete!"
echo ""
echo "🚀 Next steps:"
echo "1. Start the Python API: cd PythonApi && python run_app.py"
echo "2. Start the frontend: cd web && pnpm dev"
echo ""
echo "📊 API will be available at: http://localhost:8000"
echo "🌐 Frontend will be available at: http://localhost:3000"

if [ -d "$CHUNKS_DIR" ] && [ "$(ls -A $CHUNKS_DIR)" ]; then
    CHUNK_COUNT=$(ls "$CHUNKS_DIR"/movies_chunk_*.csv 2>/dev/null | wc -l)
    echo ""
    echo "✅ Ready with $CHUNK_COUNT data chunks!"
fi