const fs = require('fs');
const path = require('path');
const { thumbnailsDir } = require('../middleware/upload');

class MediaService {
  // Generate thumbnail for video (placeholder implementation)
  static async generateVideoThumbnail(videoPath, outputPath) {
    try {
      // For now, we'll create a placeholder thumbnail
      // In production, you'd use ffmpeg or similar tool
      const placeholderThumbnail = path.join(__dirname, '../assets/video-placeholder.png');
      
      // If placeholder doesn't exist, create a simple one
      if (!fs.existsSync(placeholderThumbnail)) {
        // Create a simple placeholder (in production, use a proper image)
        fs.writeFileSync(outputPath, '');
        return outputPath;
      }
      
      // Copy placeholder to thumbnail location
      fs.copyFileSync(placeholderThumbnail, outputPath);
      return outputPath;
    } catch (error) {
      console.error('Error generating video thumbnail:', error);
      return null;
    }
  }

  // Get image metadata
  static async getImageMetadata(imagePath) {
    try {
      const stats = fs.statSync(imagePath);
      return {
        size: stats.size,
        lastModified: stats.mtime
      };
    } catch (error) {
      console.error('Error getting image metadata:', error);
      return null;
    }
  }

  // Get video metadata (basic implementation)
  static async getVideoMetadata(videoPath) {
    try {
      const stats = fs.statSync(videoPath);
      // In production, you'd use ffprobe or similar to get duration, dimensions, etc.
      return {
        size: stats.size,
        duration: 0, // Placeholder - would get actual duration with ffprobe
        lastModified: stats.mtime
      };
    } catch (error) {
      console.error('Error getting video metadata:', error);
      return null;
    }
  }

  // Process uploaded media files
  static async processMediaFiles(files) {
    const processedFiles = {
      images: [],
      videos: []
    };

    for (const file of files) {
      try {
        const baseUrl = process.env.BACKEND_URL || 'http://localhost:5000';
        
        // Generate proper URL for static file serving
        let fileUrl;
        if (file.mimetype.startsWith('image/')) {
          fileUrl = `${baseUrl}/uploads/images/${file.filename}`;
        } else if (file.mimetype.startsWith('video/')) {
          fileUrl = `${baseUrl}/uploads/videos/${file.filename}`;
        }

        if (file.mimetype.startsWith('image/')) {
          const metadata = await this.getImageMetadata(file.path);
          processedFiles.images.push({
            url: fileUrl,
            alt: file.originalname,
            thumbnail: fileUrl, // For images, thumbnail is the same as original
            size: metadata?.size || 0,
            filename: file.filename,
            originalName: file.originalname
          });
        } else if (file.mimetype.startsWith('video/')) {
          const metadata = await this.getVideoMetadata(file.path);
          
          // Generate thumbnail for video
          const thumbnailFilename = `thumb-${file.filename}.png`;
          const thumbnailPath = path.join(thumbnailsDir, thumbnailFilename);
          const thumbnailGenerated = await this.generateVideoThumbnail(file.path, thumbnailPath);
          
          const thumbnailUrl = thumbnailGenerated 
            ? `${baseUrl}/uploads/thumbnails/${thumbnailFilename}`
            : null;

          processedFiles.videos.push({
            url: fileUrl,
            thumbnail: thumbnailUrl,
            duration: metadata?.duration || 0,
            size: metadata?.size || 0,
            filename: file.filename,
            originalName: file.originalname
          });
        }
      } catch (error) {
        console.error('Error processing file:', file.originalname, error);
      }
    }

    return processedFiles;
  }

  // Clean up uploaded files (for error cases)
  static async cleanupFiles(files) {
    for (const file of files) {
      try {
        if (fs.existsSync(file.path)) {
          fs.unlinkSync(file.path);
        }
      } catch (error) {
        console.error('Error cleaning up file:', file.path, error);
      }
    }
  }

  // Delete media files when post is deleted
  static async deleteMediaFiles(images = [], videos = []) {
    const allFiles = [...images, ...videos];
    
    for (const media of allFiles) {
      try {
        if (media.filename) {
          // Delete main file
          const mainFilePath = path.join(__dirname, '../uploads', 
            media.url.includes('/images/') ? 'images' : 'videos', 
            media.filename
          );
          if (fs.existsSync(mainFilePath)) {
            fs.unlinkSync(mainFilePath);
          }

          // Delete thumbnail if it exists
          if (media.thumbnail && media.thumbnail.includes('/thumbnails/')) {
            const thumbnailFilename = path.basename(media.thumbnail);
            const thumbnailPath = path.join(thumbnailsDir, thumbnailFilename);
            if (fs.existsSync(thumbnailPath)) {
              fs.unlinkSync(thumbnailPath);
            }
          }
        }
      } catch (error) {
        console.error('Error deleting media file:', error);
      }
    }
  }
}

module.exports = MediaService;