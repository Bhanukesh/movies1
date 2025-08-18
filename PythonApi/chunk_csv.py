#!/usr/bin/env python3
"""
Script to chunk the large CSV file into smaller, manageable pieces
"""
import pandas as pd
import os
import math
from pathlib import Path

def chunk_csv_file(input_file: str, chunk_size: int = 1000, output_dir: str = "data_chunks"):
    """
    Split a large CSV file into smaller chunks
    
    Args:
        input_file: Path to the input CSV file
        chunk_size: Number of rows per chunk
        output_dir: Directory to store chunks
    """
    input_path = Path(input_file)
    
    if not input_path.exists():
        print(f"❌ Input file not found: {input_file}")
        return False
    
    # Create output directory
    output_path = Path(output_dir)
    output_path.mkdir(exist_ok=True)
    
    print(f"📂 Processing: {input_file}")
    print(f"📊 Chunk size: {chunk_size} rows")
    print(f"💾 Output directory: {output_dir}")
    
    try:
        # Read the CSV in chunks to avoid memory issues
        chunk_reader = pd.read_csv(
            input_path,
            encoding='latin-1',
            chunksize=chunk_size,
            on_bad_lines='skip',
            low_memory=False
        )
        
        chunk_number = 0
        total_rows = 0
        
        for chunk_df in chunk_reader:
            chunk_number += 1
            chunk_filename = f"movies_chunk_{chunk_number:03d}.csv"
            chunk_path = output_path / chunk_filename
            
            # Save chunk
            chunk_df.to_csv(chunk_path, index=False)
            total_rows += len(chunk_df)
            
            print(f"✅ Created {chunk_filename}: {len(chunk_df)} rows")
        
        print(f"\n🎉 Chunking completed!")
        print(f"📈 Total rows processed: {total_rows}")
        print(f"📦 Total chunks created: {chunk_number}")
        print(f"💽 Average chunk size: {total_rows // chunk_number} rows")
        
        # Create a metadata file
        metadata = {
            "original_file": str(input_path.name),
            "total_chunks": chunk_number,
            "total_rows": total_rows,
            "chunk_size": chunk_size,
            "chunk_pattern": "movies_chunk_*.csv"
        }
        
        metadata_path = output_path / "metadata.json"
        import json
        with open(metadata_path, 'w') as f:
            json.dump(metadata, f, indent=2)
        
        print(f"📋 Metadata saved to: {metadata_path}")
        return True
        
    except Exception as e:
        print(f"❌ Error chunking CSV: {e}")
        return False

def main():
    # Configuration
    input_csv = "../Semantic_Recent.csv"  # The renamed file
    chunk_size = 1000  # 1000 movies per chunk
    output_directory = "data_chunks"
    
    print("🔧 CSV Chunking Tool")
    print("=" * 50)
    
    success = chunk_csv_file(input_csv, chunk_size, output_directory)
    
    if success:
        print(f"\n✨ Success! CSV has been chunked into {output_directory}/")
        print("\n📝 Next steps:")
        print("1. The database will automatically load from chunks")
        print("2. Each chunk contains ~1000 movies for optimal performance") 
        print("3. VS Code will no longer have issues with large files")
        print("4. Runtime memory usage will be much lower")
    else:
        print("\n💥 Failed to chunk CSV file!")

if __name__ == "__main__":
    main()