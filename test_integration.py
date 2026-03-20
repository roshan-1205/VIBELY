#!/usr/bin/env python3
"""
Vibely Integration Test
Tests the complete backend API functionality
"""

import asyncio
import aiohttp
import json
from typing import Dict, Any

BASE_URL = "http://localhost:8000/api/v1"

class VibelyTester:
    def __init__(self):
        self.session = None
        self.access_token = None
        self.user_data = None
        import time
        self.unique_id = str(int(time.time()))
        self.test_email = f"test{self.unique_id}@example.com"
        self.test_username = f"testuser{self.unique_id}"
    
    async def __aenter__(self):
        self.session = aiohttp.ClientSession()
        return self
    
    async def __aexit__(self, exc_type, exc_val, exc_tb):
        if self.session:
            await self.session.close()
    
    async def make_request(self, method: str, endpoint: str, data: Dict = None, auth: bool = True) -> Dict[str, Any]:
        """Make HTTP request to API"""
        url = f"{BASE_URL}{endpoint}"
        headers = {"Content-Type": "application/json"}
        
        if auth and self.access_token:
            headers["Authorization"] = f"Bearer {self.access_token}"
        
        kwargs = {"headers": headers}
        if data:
            kwargs["json"] = data
        
        async with self.session.request(method, url, **kwargs) as response:
            response_data = await response.json()
            print(f"{method} {endpoint}: {response.status} - {response_data.get('message', 'OK')}")
            return response_data
    
    async def test_health(self):
        """Test health endpoint"""
        print("\n🔍 Testing Health Endpoint...")
        async with self.session.get("http://localhost:8000/health") as response:
            data = await response.json()
            assert data["status"] == "healthy"
            print("✅ Health check passed")
    
    async def test_register(self):
        """Test user registration"""
        print("\n🔍 Testing User Registration...")
        user_data = {
            "username": self.test_username,
            "email": self.test_email,
            "password": "12345678",
            "name": "Test User"
        }
        
        response = await self.make_request("POST", "/auth/register", user_data, auth=False)
        print(f"Registration response: {response}")
        assert response["success"] == True
        print("✅ User registration successful")
        return response["data"]
    
    async def test_login(self):
        """Test user login"""
        print("\n🔍 Testing User Login...")
        login_data = {
            "email": self.test_email,
            "password": "12345678"
        }
        
        response = await self.make_request("POST", "/auth/login", login_data, auth=False)
        print(f"Login response: {response}")
        assert response["success"] == True
        
        self.access_token = response["data"]["access_token"]
        self.user_data = response["data"]["user"]
        print("✅ User login successful")
        print(f"   Access token: {self.access_token[:20]}...")
        return response["data"]
    
    async def test_feed(self):
        """Test feed endpoint"""
        print("\n🔍 Testing Feed Endpoint...")
        response = await self.make_request("GET", "/feed?offset=0&limit=10")
        assert response["success"] == True
        print(f"✅ Feed retrieved successfully ({len(response['data']['posts'])} posts)")
        return response["data"]
    
    async def test_create_post(self):
        """Test post creation"""
        print("\n🔍 Testing Post Creation...")
        post_data = {
            "content": "This is a test post from the integration test! 🚀",
            "image_url": None
        }
        
        response = await self.make_request("POST", "/feed", post_data)
        print(f"Create post response: {response}")
        assert response["success"] == True
        print("✅ Post created successfully")
        print(f"   Post ID: {response['data']['id']}")
        return response["data"]
    
    async def test_like_post(self, post_id: int):
        """Test post liking"""
        print("\n🔍 Testing Post Like...")
        response = await self.make_request("POST", f"/feed/{post_id}/like")
        assert response["success"] == True
        print("✅ Post liked successfully")
        print(f"   Likes count: {response['data']['likes_count']}")
        return response["data"]
    
    async def test_notifications(self):
        """Test notifications endpoint"""
        print("\n🔍 Testing Notifications...")
        response = await self.make_request("GET", "/notifications?offset=0&limit=10")
        assert response["success"] == True
        print(f"✅ Notifications retrieved successfully ({len(response['data'])} notifications)")
        return response["data"]
    
    async def run_all_tests(self):
        """Run all integration tests"""
        print("🚀 Starting Vibely Integration Tests...")
        print("=" * 50)
        
        try:
            # Test basic functionality
            await self.test_health()
            
            # Test authentication flow
            await self.test_register()
            await self.test_login()
            
            # Test core features
            await self.test_feed()
            post = await self.test_create_post()
            await self.test_like_post(post["id"])
            await self.test_notifications()
            
            print("\n" + "=" * 50)
            print("🎉 ALL TESTS PASSED! Vibely is working correctly!")
            print("✅ Authentication system working")
            print("✅ Feed system working")
            print("✅ Post creation working")
            print("✅ Like system working")
            print("✅ Notification system working")
            print("\n🌐 Frontend: http://localhost:3000")
            print("📚 API Docs: http://localhost:8000/docs")
            
        except Exception as e:
            print(f"\n❌ Test failed: {e}")
            raise

async def main():
    """Main test function"""
    async with VibelyTester() as tester:
        await tester.run_all_tests()

if __name__ == "__main__":
    asyncio.run(main())