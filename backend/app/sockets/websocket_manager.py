"""
WebSocket manager for real-time updates
Handles live likes, comments, and vibe sync broadcasts
"""

import json
import time
from typing import Dict, List, Set
from uuid import UUID
from fastapi import APIRouter, WebSocket, WebSocketDisconnect, Depends, Query
from loguru import logger

from app.core.database import get_db
from app.services.auth import AuthService

websocket_router = APIRouter()


class ConnectionManager:
    """Manages WebSocket connections for real-time updates"""
    
    def __init__(self):
        # Active connections by user ID
        self.active_connections: Dict[str, Set[WebSocket]] = {}
        # Room subscriptions (e.g., post comments)
        self.room_subscriptions: Dict[str, Set[WebSocket]] = {}
    
    async def connect(self, websocket: WebSocket, user_id: str):
        """Accept WebSocket connection and register user"""
        await websocket.accept()
        
        if user_id not in self.active_connections:
            self.active_connections[user_id] = set()
        
        self.active_connections[user_id].add(websocket)
        logger.info(f"User {user_id} connected via WebSocket")
    
    def disconnect(self, websocket: WebSocket, user_id: str):
        """Remove WebSocket connection"""
        if user_id in self.active_connections:
            self.active_connections[user_id].discard(websocket)
            
            # Clean up empty user connections
            if not self.active_connections[user_id]:
                del self.active_connections[user_id]
        
        # Remove from all room subscriptions
        for room_connections in self.room_subscriptions.values():
            room_connections.discard(websocket)
        
        logger.info(f"User {user_id} disconnected from WebSocket")
    
    async def send_personal_message(self, message: dict, user_id: str):
        """Send message to specific user's connections"""
        if user_id in self.active_connections:
            disconnected = set()
            
            for websocket in self.active_connections[user_id]:
                try:
                    await websocket.send_text(json.dumps(message))
                except Exception:
                    disconnected.add(websocket)
            
            # Clean up disconnected sockets
            for websocket in disconnected:
                self.active_connections[user_id].discard(websocket)
    
    async def broadcast_to_room(self, message: dict, room_id: str):
        """Broadcast message to all connections in a room"""
        if room_id in self.room_subscriptions:
            disconnected = set()
            
            for websocket in self.room_subscriptions[room_id]:
                try:
                    await websocket.send_text(json.dumps(message))
                except Exception:
                    disconnected.add(websocket)
            
            # Clean up disconnected sockets
            for websocket in disconnected:
                self.room_subscriptions[room_id].discard(websocket)
    
    def subscribe_to_room(self, websocket: WebSocket, room_id: str):
        """Subscribe WebSocket to a room (e.g., post comments)"""
        if room_id not in self.room_subscriptions:
            self.room_subscriptions[room_id] = set()
        
        self.room_subscriptions[room_id].add(websocket)
    
    def unsubscribe_from_room(self, websocket: WebSocket, room_id: str):
        """Unsubscribe WebSocket from a room"""
        if room_id in self.room_subscriptions:
            self.room_subscriptions[room_id].discard(websocket)


# Global connection manager
manager = ConnectionManager()


async def authenticate_websocket(token: str, db) -> str:
    """Authenticate WebSocket connection and return user ID"""
    try:
        auth_service = AuthService(db)
        # Remove 'Bearer ' prefix if present
        if token.startswith('Bearer '):
            token = token[7:]
        
        user = await auth_service.get_current_user(token)
        return str(user.id)
    except Exception as e:
        raise ValueError(f"Invalid authentication token: {str(e)}")


@websocket_router.websocket("/connect")
async def websocket_endpoint(
    websocket: WebSocket,
    token: str = Query(..., description="JWT access token"),
    db = Depends(get_db)
):
    """
    Main WebSocket endpoint for real-time connections
    Requires JWT authentication
    """
    try:
        # Authenticate user
        user_id = await authenticate_websocket(token, db)
        
        # Connect user
        await manager.connect(websocket, user_id)
        
        # Send welcome message
        await websocket.send_text(json.dumps({
            "type": "connection_established",
            "message": "Connected to Vibely real-time updates",
            "user_id": user_id
        }))
        
        # Listen for messages
        while True:
            try:
                data = await websocket.receive_text()
                message = json.loads(data)
                
                # Handle different message types
                await handle_websocket_message(websocket, user_id, message)
                
            except WebSocketDisconnect:
                break
            except json.JSONDecodeError:
                await websocket.send_text(json.dumps({
                    "type": "error",
                    "message": "Invalid JSON format"
                }))
            except Exception as e:
                logger.error(f"WebSocket message error: {e}")
                await websocket.send_text(json.dumps({
                    "type": "error",
                    "message": "Message processing failed"
                }))
    
    except ValueError as e:
        # Authentication failed
        await websocket.close(code=4001, reason=str(e))
    except Exception as e:
        logger.error(f"WebSocket connection error: {e}")
        await websocket.close(code=1011, reason="Internal server error")
    finally:
        if 'user_id' in locals():
            manager.disconnect(websocket, user_id)


async def handle_websocket_message(websocket: WebSocket, user_id: str, message: dict):
    """Handle incoming WebSocket messages"""
    message_type = message.get("type")
    
    if message_type == "subscribe_post":
        # Subscribe to post updates (likes, comments)
        post_id = message.get("post_id")
        if post_id:
            manager.subscribe_to_room(websocket, f"post:{post_id}")
            await websocket.send_text(json.dumps({
                "type": "subscribed",
                "room": f"post:{post_id}"
            }))
    
    elif message_type == "unsubscribe_post":
        # Unsubscribe from post updates
        post_id = message.get("post_id")
        if post_id:
            manager.unsubscribe_from_room(websocket, f"post:{post_id}")
            await websocket.send_text(json.dumps({
                "type": "unsubscribed",
                "room": f"post:{post_id}"
            }))
    
    elif message_type == "ping":
        # Heartbeat
        await websocket.send_text(json.dumps({
            "type": "pong",
            "timestamp": message.get("timestamp")
        }))
    
    else:
        await websocket.send_text(json.dumps({
            "type": "error",
            "message": f"Unknown message type: {message_type}"
        }))


# Helper functions for broadcasting events
async def broadcast_post_like(post_id: str, user_id: str, liked: bool):
    """Broadcast like event to post subscribers"""
    message = {
        "type": "post_like",
        "post_id": post_id,
        "user_id": user_id,
        "liked": liked,
        "timestamp": json.dumps({"$date": {"$numberLong": str(int(1000 * time.time()))}})
    }
    await manager.broadcast_to_room(message, f"post:{post_id}")


async def broadcast_new_comment(post_id: str, comment_data: dict):
    """Broadcast new comment to post subscribers"""
    message = {
        "type": "new_comment",
        "post_id": post_id,
        "comment": comment_data,
        "timestamp": json.dumps({"$date": {"$numberLong": str(int(1000 * time.time()))}})
    }
    await manager.broadcast_to_room(message, f"post:{post_id}")


async def broadcast_vibe_update(post_id: str, sentiment_data: dict):
    """Broadcast vibe analysis result to post subscribers"""
    message = {
        "type": "vibe_update",
        "post_id": post_id,
        "sentiment": sentiment_data,
        "timestamp": json.dumps({"$date": {"$numberLong": str(int(1000 * time.time()))}})
    }
    await manager.broadcast_to_room(message, f"post:{post_id}")


async def send_notification(user_id: str, notification_data: dict):
    """Send real-time notification to user"""
    message = {
        "type": "notification",
        "notification": notification_data,
        "timestamp": json.dumps({"$date": {"$numberLong": str(int(1000 * time.time()))}})
    }
    await manager.send_personal_message(message, user_id)