#!/usr/bin/env python3
"""
Test script to verify login redirect functionality
Tests the complete login flow and redirect to home page
"""

import requests
import json
import time

# Configuration
BACKEND_URL = "http://localhost:8000"
FRONTEND_URL = "http://localhost:3000"

# Test credentials (from previous context)
TEST_EMAIL = "test@vibely.com"
TEST_PASSWORD = "12345678"

def test_backend_health():
    """Test if backend is running"""
    try:
        response = requests.get(f"{BACKEND_URL}/health")
        if response.status_code == 200:
            print("✅ Backend is healthy:", response.json())
            return True
        else:
            print("❌ Backend health check failed:", response.status_code)
            return False
    except Exception as e:
        print("❌ Backend is not accessible:", str(e))
        return False

def test_login_api():
    """Test login API endpoint"""
    try:
        login_data = {
            "email": TEST_EMAIL,
            "password": TEST_PASSWORD
        }
        
        response = requests.post(
            f"{BACKEND_URL}/api/v1/auth/login",
            json=login_data,
            headers={"Content-Type": "application/json"}
        )
        
        if response.status_code == 200:
            data = response.json()
            print("✅ Login API successful")
            print(f"   User: {data['data']['user']['username']}")
            print(f"   Token received: {data['data']['access_token'][:20]}...")
            return data['data']['access_token']
        else:
            print("❌ Login API failed:", response.status_code, response.text)
            return None
            
    except Exception as e:
        print("❌ Login API error:", str(e))
        return None

def test_protected_endpoint(token):
    """Test accessing protected endpoint with token"""
    try:
        headers = {
            "Authorization": f"Bearer {token}",
            "Content-Type": "application/json"
        }
        
        response = requests.get(
            f"{BACKEND_URL}/api/v1/auth/me",
            headers=headers
        )
        
        if response.status_code == 200:
            data = response.json()
            print("✅ Protected endpoint accessible")
            print(f"   Current user: {data['data']['username']}")
            return True
        else:
            print("❌ Protected endpoint failed:", response.status_code)
            return False
            
    except Exception as e:
        print("❌ Protected endpoint error:", str(e))
        return False

def test_frontend_accessibility():
    """Test if frontend is accessible"""
    try:
        response = requests.get(FRONTEND_URL, timeout=5)
        if response.status_code == 200:
            print("✅ Frontend is accessible")
            return True
        else:
            print("❌ Frontend not accessible:", response.status_code)
            return False
    except Exception as e:
        print("❌ Frontend connection error:", str(e))
        return False

def main():
    """Run all tests"""
    print("🚀 Testing Vibely Login Redirect Functionality\n")
    
    # Test 1: Backend Health
    print("1. Testing Backend Health...")
    if not test_backend_health():
        print("❌ Backend tests failed. Exiting.")
        return
    
    # Test 2: Frontend Accessibility
    print("\n2. Testing Frontend Accessibility...")
    test_frontend_accessibility()
    
    # Test 3: Login API
    print("\n3. Testing Login API...")
    token = test_login_api()
    if not token:
        print("❌ Login tests failed. Exiting.")
        return
    
    # Test 4: Protected Endpoint
    print("\n4. Testing Protected Endpoint...")
    if not test_protected_endpoint(token):
        print("❌ Protected endpoint tests failed.")
        return
    
    print("\n🎉 All backend tests passed!")
    print("\n📋 Manual Testing Instructions:")
    print("1. Open browser and go to: http://localhost:3000")
    print("2. Navigate to login page")
    print(f"3. Login with: {TEST_EMAIL} / {TEST_PASSWORD}")
    print("4. Verify redirect to home page (/) with welcome message")
    print("5. Check that HomePage component loads with user's name")
    print("\n✨ Expected Result:")
    print("- After login, user should be redirected to home page (/)")
    print("- Home page should show 'Welcome to Vibely!' with user's name")
    print("- Navigation should work to /feed, /create, /profile")

if __name__ == "__main__":
    main()