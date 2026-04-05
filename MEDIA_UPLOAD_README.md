# VIBELY - Real-Time Media Upload System

## 🚀 Quick Start

Run the setup script to install everything:

```bash
setup.bat
```

This will:
- ✅ Install all dependencies (backend & frontend)
- ✅ Set up media upload system with multer
- ✅ Create upload directories
- ✅ Start both servers automatically

## 🎯 Features

### Real-Time Media Upload
- **Instant Upload**: Files upload immediately when selected
- **Progress Tracking**: Visual upload progress indicators
- **Batch Processing**: Handle multiple files efficiently
- **File Validation**: Type, size, and format validation

### Full Media Display
- **Direct Display**: Images and videos show directly in post cards
- **Click to Enlarge**: Images open in full screen
- **Video Controls**: Full video player with controls
- **Error Handling**: Retry functionality for failed loads

### Supported Formats
- **Images**: JPEG, PNG, GIF, WebP (max 50MB each)
- **Videos**: MP4, MPEG, MOV, WebM (max 50MB each)
- **Batch Limit**: Up to 10 files per upload

## 🔧 Manual Setup (if needed)

### Backend
```bash
cd backend
npm install
npm install multer@^1.4.5-lts.1
npm run dev
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

## 📁 File Structure

```
VIBELY/
├── backend/
│   ├── uploads/
│   │   ├── images/          # Uploaded images
│   │   ├── videos/          # Uploaded videos
│   │   └── thumbnails/      # Generated thumbnails
│   ├── middleware/upload.js # File upload configuration
│   ├── services/mediaService.js # Media processing
│   └── routes/posts.js      # Upload endpoints
├── frontend/
│   ├── components/ui/
│   │   ├── posts-feed.tsx   # Main feed with media display
│   │   ├── create-post-popup.tsx # Post creation with uploads
│   │   └── simple-image-display.tsx # Clean image display
│   └── services/api.ts      # Upload API methods
└── setup.bat               # One-click setup
```

## 🌐 API Endpoints

### Upload Media
```
POST /api/posts/upload
Content-Type: multipart/form-data
Authorization: Bearer <token>

Response:
{
  "success": true,
  "data": {
    "images": [...],
    "videos": [...],
    "totalFiles": 2
  }
}
```

### Create Post with Media
```
POST /api/posts
Content-Type: application/json
Authorization: Bearer <token>

Body:
{
  "content": "Post content",
  "postType": "image",
  "images": [...],
  "videos": [...]
}
```

## 🎮 Usage

### Quick Upload
1. Click the image icon in the post creation area
2. Select images/videos
3. Files upload automatically and post is created

### Advanced Upload
1. Open the create post popup
2. Select post type and add content
3. Add files via file picker
4. Files upload with progress indicators
5. Submit post with uploaded media

## 🔍 Troubleshooting

### Images Not Displaying
1. **Check servers are running**:
   - Backend: http://localhost:5000
   - Frontend: http://localhost:3000

2. **Test direct image access**:
   - Go to: http://localhost:5000/uploads/images/test.svg
   - Should show a blue test image

3. **Check browser console** for error messages

4. **Restart servers** if needed

### Upload Issues
- **File too large**: Max 50MB per file
- **Invalid format**: Check supported formats above
- **Server error**: Check backend console logs

### Common Fixes
```bash
# Restart everything
setup.bat

# Manual restart
cd backend && npm run dev
cd frontend && npm run dev

# Clear browser cache
Ctrl + Shift + R
```

## 🏗️ Architecture

### Backend Components
- **Multer Middleware**: Handles multipart file uploads
- **Media Service**: Processes files and generates URLs
- **Static Serving**: Serves uploaded files via Express
- **Validation**: File type, size, and format checks

### Frontend Components
- **Real-Time Upload**: Immediate file processing
- **Progress Tracking**: Visual feedback during upload
- **Error Recovery**: Retry failed uploads
- **Clean Display**: Professional image/video display

### Real-Time Features
- **Socket.IO Integration**: Live post updates
- **Immediate Preview**: Files display as they upload
- **Progress Indicators**: Visual upload status
- **Error Handling**: Graceful failure recovery

## 🔒 Security

- **Authentication Required**: All uploads require valid JWT
- **File Validation**: Type, size, and format checks
- **Size Limits**: 50MB per file, 10 files per batch
- **CORS Headers**: Proper cross-origin handling
- **Error Cleanup**: Failed uploads are cleaned up

## 🚀 Production Considerations

For production deployment:
- Use cloud storage (AWS S3, Cloudinary)
- Implement image compression
- Add video transcoding
- Set up CDN for faster delivery
- Add virus scanning
- Implement rate limiting

## 📞 Support

If you encounter issues:
1. Check browser console for errors
2. Check backend console for server errors
3. Verify file formats and sizes
4. Test with the provided test image
5. Restart both servers

The system is designed to work out of the box with the setup script!