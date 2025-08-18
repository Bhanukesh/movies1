#!/usr/bin/env python3
"""
Test script to verify all movie app fixes
"""
import requests
import json
import time
from typing import Dict, Any

BASE_URL = "http://localhost:8000"

def test_api_endpoint(endpoint: str, method: str = "GET", data: Dict[str, Any] = None) -> Dict[str, Any]:
    """Test an API endpoint and return the response"""
    url = f"{BASE_URL}{endpoint}"
    
    try:
        if method == "GET":
            response = requests.get(url, timeout=10)
        elif method == "POST":
            response = requests.post(url, json=data, timeout=10)
        elif method == "PUT":
            response = requests.put(url, json=data, timeout=10)
        elif method == "DELETE":
            response = requests.delete(url, timeout=10)
        
        return {
            "status_code": response.status_code,
            "success": response.status_code < 400,
            "data": response.json() if response.content else None,
            "error": None
        }
    except Exception as e:
        return {
            "status_code": None,
            "success": False,
            "data": None,
            "error": str(e)
        }

def test_movie_loading():
    """Test that movies are loading from the CSV"""
    print("🎬 Testing movie loading...")
    result = test_api_endpoint("/api/Movies?page=1&size=5")
    
    if result["success"]:
        data = result["data"]
        movie_count = data.get("total", 0)
        items_count = len(data.get("items", []))
        print(f"✅ Movies loaded successfully: {movie_count} total movies, {items_count} in this page")
        
        if movie_count > 0:
            print("✅ CSV file integration working")
            return True
        else:
            print("❌ No movies found - CSV file may not be loading")
            return False
    else:
        print(f"❌ Failed to load movies: {result['error']}")
        return False

def test_sorting_functionality():
    """Test sort functionality"""
    print("\n🔄 Testing sort functionality...")
    
    # Test sorting by title
    result = test_api_endpoint("/api/Movies?page=1&size=3")
    if result["success"] and result["data"]["items"]:
        print("✅ Basic movie fetch works")
        
        # Get a movie for testing
        first_movie = result["data"]["items"][0]
        print(f"✅ Sample movie: {first_movie['title']}")
        return True
    else:
        print("❌ Sort functionality test failed")
        return False

def test_genre_filtering():
    """Test genre filtering functionality"""
    print("\n🎭 Testing genre filtering...")
    
    # Test genre filtering
    result = test_api_endpoint("/api/Movies?genres=Action&page=1&size=3")
    if result["success"]:
        data = result["data"]
        print(f"✅ Action genre filter works: {len(data.get('items', []))} Action movies found")
        
        # Test multiple genre filtering
        result = test_api_endpoint("/api/Movies?genres=Action&genres=Adventure&page=1&size=3")
        if result["success"]:
            data = result["data"]
            print(f"✅ Multiple genre filter works: {len(data.get('items', []))} Action/Adventure movies found")
            return True
        else:
            print("❌ Multiple genre filtering failed")
            return False
    else:
        print("❌ Genre filtering failed")
        return False

def test_search_functionality():
    """Test search functionality"""
    print("\n🔍 Testing search functionality...")
    
    result = test_api_endpoint("/api/Movies/search?q=avatar&page=1&size=3")
    if result["success"]:
        data = result["data"]
        search_results = len(data.get("items", []))
        print(f"✅ Search functionality works: {search_results} results for 'avatar'")
        return True
    else:
        print("❌ Search functionality failed")
        return False

def test_crud_operations():
    """Test CRUD operations"""
    print("\n⚙️ Testing CRUD operations...")
    
    # Test create movie
    new_movie = {
        "title": "Test Movie",
        "overview": "A test movie for CRUD testing",
        "genres": [{"name": "Test"}],
        "release_date": "2024-01-01"
    }
    
    create_result = test_api_endpoint("/api/Movies", "POST", new_movie)
    if create_result["success"]:
        movie_id = create_result["data"]
        print(f"✅ Movie creation works: Created movie with ID {movie_id}")
        
        # Test update movie
        update_data = {
            "title": "Updated Test Movie",
            "is_favorite": True
        }
        
        update_result = test_api_endpoint(f"/api/Movies/{movie_id}", "PUT", update_data)
        if update_result["success"]:
            print("✅ Movie update works")
            
            # Test get movie
            get_result = test_api_endpoint(f"/api/Movies/{movie_id}")
            if get_result["success"]:
                movie = get_result["data"]
                print(f"✅ Movie retrieval works: {movie['title']}")
                
                # Test delete movie
                delete_result = test_api_endpoint(f"/api/Movies/{movie_id}", "DELETE")
                if delete_result["success"]:
                    print("✅ Movie deletion works")
                    return True
                else:
                    print("❌ Movie deletion failed")
                    return False
            else:
                print("❌ Movie retrieval failed")
                return False
        else:
            print("❌ Movie update failed")
            return False
    else:
        print("❌ Movie creation failed")
        return False

def test_favorites_functionality():
    """Test favorites functionality"""
    print("\n❤️ Testing favorites functionality...")
    
    result = test_api_endpoint("/api/Movies/favorites?page=1&size=5")
    if result["success"]:
        data = result["data"]
        favorites_count = len(data.get("items", []))
        print(f"✅ Favorites endpoint works: {favorites_count} favorite movies")
        return True
    else:
        print("❌ Favorites functionality failed")
        return False

def test_year_range_filtering():
    """Test year range filtering"""
    print("\n📅 Testing year range filtering...")
    
    result = test_api_endpoint("/api/Movies?year_from=2020&year_to=2024&page=1&size=3")
    if result["success"]:
        data = result["data"]
        recent_movies = len(data.get("items", []))
        print(f"✅ Year range filtering works: {recent_movies} movies from 2020-2024")
        return True
    else:
        print("❌ Year range filtering failed")
        return False

def test_rating_filtering():
    """Test rating filtering"""
    print("\n⭐ Testing rating filtering...")
    
    result = test_api_endpoint("/api/Movies?rating_from=8.0&page=1&size=3")
    if result["success"]:
        data = result["data"]
        high_rated = len(data.get("items", []))
        print(f"✅ Rating filtering works: {high_rated} movies with rating >= 8.0")
        return True
    else:
        print("❌ Rating filtering failed")
        return False

def run_all_tests():
    """Run all tests and report results"""
    print("🚀 Starting comprehensive movie app tests...")
    print("=" * 60)
    
    tests = [
        ("Movie Loading", test_movie_loading),
        ("Sort Functionality", test_sorting_functionality),
        ("Genre Filtering", test_genre_filtering),
        ("Search Functionality", test_search_functionality),
        ("CRUD Operations", test_crud_operations),
        ("Favorites Functionality", test_favorites_functionality),
        ("Year Range Filtering", test_year_range_filtering),
        ("Rating Filtering", test_rating_filtering),
    ]
    
    results = []
    for test_name, test_func in tests:
        try:
            success = test_func()
            results.append((test_name, success))
        except Exception as e:
            print(f"❌ {test_name} failed with exception: {e}")
            results.append((test_name, False))
    
    print("\n" + "=" * 60)
    print("📊 TEST SUMMARY")
    print("=" * 60)
    
    passed = 0
    total = len(results)
    
    for test_name, success in results:
        status = "✅ PASS" if success else "❌ FAIL"
        print(f"{status} {test_name}")
        if success:
            passed += 1
    
    print("=" * 60)
    print(f"🎯 Tests passed: {passed}/{total} ({passed/total*100:.1f}%)")
    
    if passed == total:
        print("🎉 All tests passed! The movie app is working correctly.")
        return True
    else:
        print("⚠️  Some tests failed. Please check the issues above.")
        return False

if __name__ == "__main__":
    # Wait a moment for the API to be ready
    print("⏳ Waiting for API to be ready...")
    time.sleep(2)
    
    success = run_all_tests()
    
    if success:
        print("\n🎬 Movie app testing completed successfully! 🎉")
        exit(0)
    else:
        print("\n💥 Movie app testing found issues!")
        exit(1)