import { useState, useEffect } from 'react'

export const useProfileImage = (userId?: string) => {
  const [profileImage, setProfileImage] = useState<string | null>(null)

  // Load profile image when userId changes
  useEffect(() => {
    if (userId) {
      try {
        const savedImage = localStorage.getItem(`vibely_profile_image_${userId}`)
        setProfileImage(savedImage)
      } catch (error) {
        console.error('Error loading profile image:', error)
        setProfileImage(null)
      }
    } else {
      setProfileImage(null)
    }
  }, [userId])

  // Save profile image to localStorage
  const saveProfileImage = (imageData: string, userId: string) => {
    try {
      localStorage.setItem(`vibely_profile_image_${userId}`, imageData)
      setProfileImage(imageData)
    } catch (error) {
      console.error('Error saving profile image:', error)
    }
  }

  // Remove profile image from localStorage
  const removeProfileImage = (userId: string) => {
    try {
      localStorage.removeItem(`vibely_profile_image_${userId}`)
      setProfileImage(null)
    } catch (error) {
      console.error('Error removing profile image:', error)
    }
  }

  // Clear profile image (for logout)
  const clearProfileImage = () => {
    setProfileImage(null)
  }

  return {
    profileImage,
    saveProfileImage,
    removeProfileImage,
    clearProfileImage,
    setProfileImage
  }
}