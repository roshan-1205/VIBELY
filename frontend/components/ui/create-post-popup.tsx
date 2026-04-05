'use client'

import { useState, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  X, 
  Image as ImageIcon, 
  Video, 
  Quote, 
  MapPin, 
  Smile, 
  Hash, 
  AtSign,
  Calendar,
  Clock,
  Globe,
  Users,
  Lock,
  Upload,
  Trash2,
  Play,
  Pause,
  Volume2,
  VolumeX
} from 'lucide-react'
import { Button } from './button'
import { Input } from './input'
import { Label } from './label'
import { Card } from './card'
import { useAuth } from '@/contexts/AuthContext'
import { apiService } from '@/services/api'
import { useSocket } from '@/contexts/SocketContext'

interface CreatePostPopupProps {
  isOpen: boolean
  onClose: () => void
}

type PostType = 'text' | 'image' | 'video' | 'quote'
type PostVisibility = 'public' | 'followers' | 'private'

interface MediaFile {
  id: string
  file: File
  url: string
  type: 'image' | 'video'
  thumbnail?: string
  uploaded?: boolean
  uploading?: boolean
  uploadProgress?: number
  uploadedData?: {
    url: string
    thumbnail?: string
    size: number
    filename: string
    originalName: string
    duration?: number
  }
}

export const CreatePostPopup = ({ isOpen, onClose }: CreatePostPopupProps) => {
  const { user } = useAuth()
  const { socket } = useSocket()
  const [postType, setPostType] = useState<PostType>('text')
  const [content, setContent] = useState('')
  const [quoteAuthor, setQuoteAuthor] = useState('')
  const [location, setLocation] = useState('')
  const [visibility, setVisibility] = useState<PostVisibility>('public')
  const [tags, setTags] = useState<string[]>([])
  const [mentions, setMentions] = useState<string[]>([])
  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [scheduledDate, setScheduledDate] = useState('')
  const [currentTag, setCurrentTag] = useState('')
  const [currentMention, setCurrentMention] = useState('')
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  
  const fileInputRef = useRef<HTMLInputElement>(null)
  const videoRefs = useRef<{ [key: string]: HTMLVideoElement }>({})

  // Common emojis for quick access
  const commonEmojis = ['😊', '😍', '🤔', '😂', '❤️', '👍', '🎉', '🔥', '💯', '✨', '🌟', '💪', '🙌', '👏', '🎯', '💡']

  const handleClose = useCallback(() => {
    // Clean up object URLs
    mediaFiles.forEach(file => {
      if (file.url.startsWith('blob:')) {
        URL.revokeObjectURL(file.url)
      }
    })
    
    // Reset all form data
    setPostType('text')
    setContent('')
    setQuoteAuthor('')
    setLocation('')
    setVisibility('public')
    setTags([])
    setMentions([])
    setMediaFiles([])
    setScheduledDate('')
    setCurrentTag('')
    setCurrentMention('')
    setShowEmojiPicker(false)
    setIsUploading(false)
    setUploadProgress(0)
    onClose()
  }, [onClose, mediaFiles])

  const handleFileSelect = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])
    
    if (files.length === 0) return

    // Validate files first
    const validFiles = files.filter(file => {
      if (file.size > 50 * 1024 * 1024) { // 50MB limit
        alert(`File ${file.name} is too large. Maximum size is 50MB.`)
        return false
      }
      
      const isValidType = file.type.startsWith('image/') || file.type.startsWith('video/')
      if (!isValidType) {
        alert(`File ${file.name} is not a valid image or video file.`)
        return false
      }
      
      return true
    })

    if (validFiles.length === 0) {
      // Reset input
      if (event.target) {
        event.target.value = ''
      }
      return
    }

    // Create media file objects with preview URLs
    const newMediaFiles: MediaFile[] = validFiles.map(file => {
      const fileType = file.type.startsWith('image/') ? 'image' : 'video'
      const fileId = Math.random().toString(36).substr(2, 9)
      const url = URL.createObjectURL(file)

      return {
        id: fileId,
        file,
        url,
        type: fileType,
        uploaded: false,
        uploading: false,
        uploadProgress: 0
      }
    })

    // Add files to state immediately for preview
    setMediaFiles(prev => [...prev, ...newMediaFiles])

    // Generate thumbnails for videos
    newMediaFiles.forEach(mediaFile => {
      if (mediaFile.type === 'video') {
        const video = document.createElement('video')
        video.src = mediaFile.url
        video.currentTime = 1
        video.onloadeddata = () => {
          const canvas = document.createElement('canvas')
          canvas.width = video.videoWidth
          canvas.height = video.videoHeight
          const ctx = canvas.getContext('2d')
          ctx?.drawImage(video, 0, 0)
          const thumbnail = canvas.toDataURL()
          
          setMediaFiles(prev => prev.map(f => 
            f.id === mediaFile.id ? { ...f, thumbnail } : f
          ))
        }
      }
    })

    // Start uploading files immediately
    try {
      setIsUploading(true)
      
      // Upload files in batches to avoid overwhelming the server
      const batchSize = 3
      for (let i = 0; i < validFiles.length; i += batchSize) {
        const batch = validFiles.slice(i, i + batchSize)
        const batchIds = newMediaFiles.slice(i, i + batchSize).map(f => f.id)
        
        // Mark batch as uploading
        setMediaFiles(prev => prev.map(f => 
          batchIds.includes(f.id) ? { ...f, uploading: true } : f
        ))

        try {
          const response = await apiService.uploadMedia(batch)
          
          if (response.success && response.data) {
            // Update media files with uploaded data
            setMediaFiles(prev => prev.map(f => {
              const batchIndex = batchIds.indexOf(f.id)
              if (batchIndex === -1) return f

              const uploadedImage = response.data!.images[batchIndex]
              const uploadedVideo = response.data!.videos[batchIndex - response.data!.images.length]
              const uploadedData = uploadedImage || uploadedVideo

              return {
                ...f,
                uploaded: true,
                uploading: false,
                uploadProgress: 100,
                uploadedData
              }
            }))
          }
        } catch (error) {
          console.error('Upload error for batch:', error)
          // Mark batch as failed
          setMediaFiles(prev => prev.map(f => 
            batchIds.includes(f.id) ? { ...f, uploading: false, uploadProgress: 0 } : f
          ))
        }
      }
    } catch (error) {
      console.error('Upload error:', error)
    } finally {
      setIsUploading(false)
    }

    // Reset input
    if (event.target) {
      event.target.value = ''
    }
  }, [])

  const removeMediaFile = useCallback((fileId: string) => {
    setMediaFiles(prev => {
      const file = prev.find(f => f.id === fileId)
      if (file && file.url.startsWith('blob:')) {
        URL.revokeObjectURL(file.url)
      }
      return prev.filter(f => f.id !== fileId)
    })
  }, [])

  const addTag = useCallback(() => {
    if (currentTag.trim() && !tags.includes(currentTag.trim())) {
      setTags(prev => [...prev, currentTag.trim()])
      setCurrentTag('')
    }
  }, [currentTag, tags])

  const removeTag = useCallback((tag: string) => {
    setTags(prev => prev.filter(t => t !== tag))
  }, [])

  const addMention = useCallback(() => {
    if (currentMention.trim() && !mentions.includes(currentMention.trim())) {
      setMentions(prev => [...prev, currentMention.trim()])
      setCurrentMention('')
    }
  }, [currentMention, mentions])

  const removeMention = useCallback((mention: string) => {
    setMentions(prev => prev.filter(m => m !== mention))
  }, [])

  const insertEmoji = useCallback((emoji: string) => {
    setContent(prev => prev + emoji)
    setShowEmojiPicker(false)
  }, [])

  const handleSubmit = async () => {
    if (!content.trim() && mediaFiles.length === 0) {
      alert('Please add some content or media to your post.')
      return
    }

    // Check if any files are still uploading
    const stillUploading = mediaFiles.some(f => f.uploading)
    if (stillUploading) {
      alert('Please wait for all files to finish uploading.')
      return
    }

    // Check if any files failed to upload
    const failedUploads = mediaFiles.filter(f => !f.uploaded && !f.uploading)
    if (failedUploads.length > 0) {
      const retry = confirm(`${failedUploads.length} file(s) failed to upload. Do you want to retry uploading them?`)
      if (retry) {
        // Retry failed uploads
        try {
          setIsUploading(true)
          const failedFiles = failedUploads.map(f => f.file)
          const response = await apiService.uploadMedia(failedFiles)
          
          if (response.success && response.data) {
            // Update failed files with uploaded data
            setMediaFiles(prev => prev.map(f => {
              const failedIndex = failedUploads.findIndex(failed => failed.id === f.id)
              if (failedIndex === -1) return f

              const uploadedImage = response.data!.images[failedIndex]
              const uploadedVideo = response.data!.videos[failedIndex - response.data!.images.length]
              const uploadedData = uploadedImage || uploadedVideo

              return {
                ...f,
                uploaded: true,
                uploading: false,
                uploadProgress: 100,
                uploadedData
              }
            }))
          }
        } catch (error) {
          console.error('Retry upload error:', error)
          alert('Failed to retry uploads. Please try again.')
          return
        } finally {
          setIsUploading(false)
        }
      } else {
        return
      }
    }

    setIsSubmitting(true)

    try {
      // Prepare uploaded media data
      const uploadedImages = mediaFiles
        .filter(f => f.type === 'image' && f.uploaded && f.uploadedData)
        .map(f => ({
          url: f.uploadedData!.url,
          alt: f.uploadedData!.originalName,
          thumbnail: f.uploadedData!.thumbnail,
          size: f.uploadedData!.size,
          filename: f.uploadedData!.filename,
          originalName: f.uploadedData!.originalName
        }))

      const uploadedVideos = mediaFiles
        .filter(f => f.type === 'video' && f.uploaded && f.uploadedData)
        .map(f => ({
          url: f.uploadedData!.url,
          thumbnail: f.uploadedData!.thumbnail,
          duration: f.uploadedData!.duration || 0,
          size: f.uploadedData!.size,
          filename: f.uploadedData!.filename,
          originalName: f.uploadedData!.originalName
        }))

      // Determine post type based on media
      let finalPostType = postType
      if (finalPostType === 'text' && uploadedImages.length > 0) {
        finalPostType = 'image'
      } else if (finalPostType === 'text' && uploadedVideos.length > 0) {
        finalPostType = 'video'
      }

      // Prepare post data
      const postData = {
        content: content.trim(),
        postType: finalPostType,
        visibility,
        location: location.trim() || undefined,
        tags: tags.length > 0 ? tags : undefined,
        mentions: mentions.length > 0 ? mentions : undefined,
        quoteAuthor: postType === 'quote' ? quoteAuthor.trim() : undefined,
        scheduledDate: scheduledDate || undefined,
        images: uploadedImages.length > 0 ? uploadedImages : undefined,
        videos: uploadedVideos.length > 0 ? uploadedVideos : undefined
      }

      const response = await apiService.createPost(postData)

      if (response.success) {
        // Emit real-time event
        if (socket) {
          socket.emit('post:created', response.data?.post)
        }

        handleClose()
        
        // Show success message
        alert('Post created successfully!')
      } else {
        throw new Error(response.message || 'Failed to create post')
      }
    } catch (error) {
      console.error('Error creating post:', error)
      alert(error instanceof Error ? error.message : 'Failed to create post')
    } finally {
      setIsSubmitting(false)
    }
  }

  const toggleVideoPlay = (fileId: string) => {
    const video = videoRefs.current[fileId]
    if (video) {
      if (video.paused) {
        video.play()
      } else {
        video.pause()
      }
    }
  }

  const toggleVideoMute = (fileId: string) => {
    const video = videoRefs.current[fileId]
    if (video) {
      video.muted = !video.muted
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            onClick={handleClose}
          />
          
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", duration: 0.4, bounce: 0.1 }}
            className="fixed inset-0 flex items-center justify-center z-50 p-4"
          >
            <Card className="w-full max-w-2xl max-h-[90vh] overflow-hidden bg-white dark:bg-gray-900 shadow-2xl">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Create New Post
                </h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleClose}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto max-h-[calc(90vh-140px)]">
                <div className="p-6 space-y-6">
                  {/* Post Type Selection */}
                  <div>
                    <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 block">
                      Post Type
                    </Label>
                    <div className="flex gap-2 flex-wrap">
                      {[
                        { type: 'text' as PostType, icon: <Hash className="w-4 h-4" />, label: 'Text' },
                        { type: 'image' as PostType, icon: <ImageIcon className="w-4 h-4" />, label: 'Image' },
                        { type: 'video' as PostType, icon: <Video className="w-4 h-4" />, label: 'Video' },
                        { type: 'quote' as PostType, icon: <Quote className="w-4 h-4" />, label: 'Quote' }
                      ].map(({ type, icon, label }) => (
                        <Button
                          key={type}
                          variant={postType === type ? "default" : "outline"}
                          size="sm"
                          onClick={() => setPostType(type)}
                          className="flex items-center gap-2"
                        >
                          {icon}
                          {label}
                        </Button>
                      ))}
                    </div>
                  </div>

                  {/* Content Input */}
                  <div>
                    <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                      {postType === 'quote' ? 'Quote Content' : 'What\'s on your mind?'}
                    </Label>
                    <div className="relative">
                      <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder={
                          postType === 'quote' 
                            ? 'Enter your favorite quote...' 
                            : 'Share your thoughts, ideas, or updates...'
                        }
                        className="w-full min-h-[120px] p-3 border border-gray-300 dark:border-gray-600 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                        maxLength={2000}
                      />
                      <div className="absolute bottom-2 right-2 flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                          className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                        >
                          <Smile className="w-4 h-4" />
                        </Button>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {content.length}/2000
                        </span>
                      </div>
                    </div>

                    {/* Emoji Picker */}
                    {showEmojiPicker && (
                      <div className="mt-2 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                        <div className="flex flex-wrap gap-2">
                          {commonEmojis.map(emoji => (
                            <button
                              key={emoji}
                              onClick={() => insertEmoji(emoji)}
                              className="text-lg hover:bg-gray-200 dark:hover:bg-gray-700 rounded p-1 transition-colors"
                            >
                              {emoji}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Quote Author (only for quote posts) */}
                  {postType === 'quote' && (
                    <div>
                      <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                        Quote Author (Optional)
                      </Label>
                      <Input
                        value={quoteAuthor}
                        onChange={(e) => setQuoteAuthor(e.target.value)}
                        placeholder="Who said this quote?"
                        className="w-full"
                      />
                    </div>
                  )}

                  {/* Media Upload */}
                  <div>
                    <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                      Media (Optional)
                    </Label>
                    <div className="space-y-3">
                      <Button
                        variant="outline"
                        onClick={() => fileInputRef.current?.click()}
                        className="w-full flex items-center gap-2"
                        disabled={isSubmitting}
                      >
                        <Upload className="w-4 h-4" />
                        Upload Images or Videos
                      </Button>
                      <input
                        ref={fileInputRef}
                        type="file"
                        multiple
                        accept="image/*,video/*"
                        onChange={handleFileSelect}
                        className="hidden"
                      />

                      {/* Media Preview */}
                      {mediaFiles.length > 0 && (
                        <div className="grid grid-cols-2 gap-3">
                          {mediaFiles.map(file => (
                            <div key={file.id} className="relative group">
                              {file.type === 'image' ? (
                                <img
                                  src={file.url}
                                  alt="Upload preview"
                                  className="w-full h-32 object-cover rounded-lg"
                                />
                              ) : (
                                <div className="relative">
                                  <video
                                    ref={el => {
                                      if (el) videoRefs.current[file.id] = el
                                    }}
                                    src={file.url}
                                    className="w-full h-32 object-cover rounded-lg"
                                    muted
                                  />
                                  <div className="absolute inset-0 flex items-center justify-center">
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => toggleVideoPlay(file.id)}
                                      className="bg-black/50 text-white hover:bg-black/70"
                                    >
                                      <Play className="w-4 h-4" />
                                    </Button>
                                  </div>
                                </div>
                              )}
                              
                              {/* Upload Status Overlay */}
                              {(file.uploading || !file.uploaded) && (
                                <div className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center">
                                  {file.uploading ? (
                                    <div className="text-white text-center">
                                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mx-auto mb-2"></div>
                                      <div className="text-xs">Uploading...</div>
                                    </div>
                                  ) : (
                                    <div className="text-white text-center">
                                      <div className="text-red-400 mb-1">⚠</div>
                                      <div className="text-xs">Upload failed</div>
                                    </div>
                                  )}
                                </div>
                              )}
                              
                              {/* Success indicator */}
                              {file.uploaded && (
                                <div className="absolute top-1 left-1 bg-green-500 text-white rounded-full p-1">
                                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                  </svg>
                                </div>
                              )}
                              
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => removeMediaFile(file.id)}
                                className="absolute top-1 right-1 bg-red-500 text-white hover:bg-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <Trash2 className="w-3 h-3" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Location */}
                  <div>
                    <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                      Location (Optional)
                    </Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        placeholder="Add a location..."
                        className="pl-10"
                      />
                    </div>
                  </div>

                  {/* Tags */}
                  <div>
                    <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                      Tags (Optional)
                    </Label>
                    <div className="space-y-2">
                      <div className="flex gap-2">
                        <div className="relative flex-1">
                          <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                          <Input
                            value={currentTag}
                            onChange={(e) => setCurrentTag(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                            placeholder="Add a tag..."
                            className="pl-10"
                          />
                        </div>
                        <Button onClick={addTag} disabled={!currentTag.trim()}>
                          Add
                        </Button>
                      </div>
                      {tags.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {tags.map(tag => (
                            <span
                              key={tag}
                              className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm"
                            >
                              #{tag}
                              <button
                                onClick={() => removeTag(tag)}
                                className="text-blue-600 dark:text-blue-300 hover:text-blue-800 dark:hover:text-blue-100"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Mentions */}
                  <div>
                    <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                      Mentions (Optional)
                    </Label>
                    <div className="space-y-2">
                      <div className="flex gap-2">
                        <div className="relative flex-1">
                          <AtSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                          <Input
                            value={currentMention}
                            onChange={(e) => setCurrentMention(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addMention())}
                            placeholder="Mention someone..."
                            className="pl-10"
                          />
                        </div>
                        <Button onClick={addMention} disabled={!currentMention.trim()}>
                          Add
                        </Button>
                      </div>
                      {mentions.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {mentions.map(mention => (
                            <span
                              key={mention}
                              className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-full text-sm"
                            >
                              @{mention}
                              <button
                                onClick={() => removeMention(mention)}
                                className="text-green-600 dark:text-green-300 hover:text-green-800 dark:hover:text-green-100"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Visibility & Scheduling */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Visibility */}
                    <div>
                      <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                        Visibility
                      </Label>
                      <select
                        value={visibility}
                        onChange={(e) => setVisibility(e.target.value as PostVisibility)}
                        className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      >
                        <option value="public">🌍 Public</option>
                        <option value="followers">👥 Followers Only</option>
                        <option value="private">🔒 Private</option>
                      </select>
                    </div>

                    {/* Schedule */}
                    <div>
                      <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                        Schedule (Optional)
                      </Label>
                      <Input
                        type="datetime-local"
                        value={scheduledDate}
                        onChange={(e) => setScheduledDate(e.target.value)}
                        min={new Date().toISOString().slice(0, 16)}
                        className="w-full"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between p-6 border-t border-gray-200 dark:border-gray-700">
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {scheduledDate ? (
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      Scheduled for {new Date(scheduledDate).toLocaleString()}
                    </span>
                  ) : (
                    <span className="flex items-center gap-1">
                      {visibility === 'public' && <Globe className="w-4 h-4" />}
                      {visibility === 'followers' && <Users className="w-4 h-4" />}
                      {visibility === 'private' && <Lock className="w-4 h-4" />}
                      {visibility === 'public' ? 'Everyone can see this' : 
                       visibility === 'followers' ? 'Only followers can see this' : 
                       'Only you can see this'}
                    </span>
                  )}
                </div>
                <div className="flex gap-3">
                  <Button variant="outline" onClick={handleClose} disabled={isSubmitting || isUploading}>
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleSubmit} 
                    disabled={
                      isSubmitting || 
                      isUploading || 
                      (!content.trim() && mediaFiles.length === 0) ||
                      mediaFiles.some(f => f.uploading)
                    }
                  >
                    {isSubmitting ? (
                      <div className="flex items-center gap-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        {scheduledDate ? 'Scheduling...' : 'Posting...'}
                      </div>
                    ) : isUploading || mediaFiles.some(f => f.uploading) ? (
                      <div className="flex items-center gap-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        Uploading...
                      </div>
                    ) : (
                      scheduledDate ? 'Schedule Post' : 'Post Now'
                    )}
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}