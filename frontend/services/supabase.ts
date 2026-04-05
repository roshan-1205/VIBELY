import { createClient } from '@/utils/supabase/client'
import { createClient as createServerClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'

// Types for Supabase tables
export interface SupabaseUser {
  id: string
  first_name: string
  last_name: string
  email: string
  avatar?: string
  bio?: string
  location?: string
  phone?: string
  coordinates?: any
  website?: string
  is_email_verified: boolean
  is_online: boolean
  last_seen?: string
  last_login?: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface SupabasePost {
  id: string
  author_id: string
  content: string
  media_urls?: string[]
  media_type: string
  location?: string
  coordinates?: any
  is_public: boolean
  likes_count: number
  comments_count: number
  shares_count: number
  created_at: string
  updated_at: string
  // Relations
  author?: SupabaseUser
}

export class SupabaseService {
  private supabase = createClient()

  // Auth methods
  async signUp(email: string, password: string, userData: { firstName: string, lastName: string }) {
    const { data, error } = await this.supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          first_name: userData.firstName,
          last_name: userData.lastName,
        }
      }
    })

    if (error) throw error

    // Create user profile in our users table
    if (data.user) {
      const { error: profileError } = await this.supabase
        .from('users')
        .insert({
          id: data.user.id,
          first_name: userData.firstName,
          last_name: userData.lastName,
          email: email,
          is_email_verified: false,
          is_active: true
        })

      if (profileError) throw profileError
    }

    return data
  }

  async signIn(email: string, password: string) {
    const { data, error } = await this.supabase.auth.signInWithPassword({
      email,
      password
    })

    if (error) throw error
    return data
  }

  async signOut() {
    const { error } = await this.supabase.auth.signOut()
    if (error) throw error
  }

  async getCurrentUser() {
    const { data: { user }, error } = await this.supabase.auth.getUser()
    if (error) throw error

    if (user) {
      // Get user profile from our users table
      const { data: profile, error: profileError } = await this.supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single()

      if (profileError) throw profileError
      return profile
    }

    return null
  }

  // Posts methods
  async createPost(content: string, mediaUrls?: string[], mediaType: string = 'text') {
    const user = await this.getCurrentUser()
    if (!user) throw new Error('User not authenticated')

    const { data, error } = await this.supabase
      .from('posts')
      .insert({
        author_id: user.id,
        content,
        media_urls: mediaUrls,
        media_type: mediaType,
        is_public: true
      })
      .select('*, author:users(*)')
      .single()

    if (error) throw error
    return data
  }

  async getPosts(page: number = 1, limit: number = 10) {
    const offset = (page - 1) * limit

    const { data, error } = await this.supabase
      .from('posts')
      .select(`
        *,
        author:users(*),
        likes:likes(count),
        comments:comments(count)
      `)
      .eq('is_public', true)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (error) throw error
    return data
  }

  async likePost(postId: string) {
    const user = await this.getCurrentUser()
    if (!user) throw new Error('User not authenticated')

    // Check if already liked
    const { data: existingLike } = await this.supabase
      .from('likes')
      .select('id')
      .eq('user_id', user.id)
      .eq('post_id', postId)
      .single()

    if (existingLike) {
      // Unlike
      const { error } = await this.supabase
        .from('likes')
        .delete()
        .eq('user_id', user.id)
        .eq('post_id', postId)

      if (error) throw error

      // Decrement likes count
      const { error: updateError } = await this.supabase
        .from('posts')
        .update({ likes_count: this.supabase.sql`likes_count - 1` })
        .eq('id', postId)

      if (updateError) throw updateError

      return { isLiked: false }
    } else {
      // Like
      const { error } = await this.supabase
        .from('likes')
        .insert({
          user_id: user.id,
          post_id: postId
        })

      if (error) throw error

      // Increment likes count
      const { error: updateError } = await this.supabase
        .from('posts')
        .update({ likes_count: this.supabase.sql`likes_count + 1` })
        .eq('id', postId)

      if (updateError) throw updateError

      return { isLiked: true }
    }
  }

  // Follow methods
  async followUser(userId: string) {
    const currentUser = await this.getCurrentUser()
    if (!currentUser) throw new Error('User not authenticated')

    // Check if already following
    const { data: existingFollow } = await this.supabase
      .from('follows')
      .select('id')
      .eq('follower_id', currentUser.id)
      .eq('following_id', userId)
      .single()

    if (existingFollow) {
      // Unfollow
      const { error } = await this.supabase
        .from('follows')
        .delete()
        .eq('follower_id', currentUser.id)
        .eq('following_id', userId)

      if (error) throw error
      return { isFollowing: false }
    } else {
      // Follow
      const { error } = await this.supabase
        .from('follows')
        .insert({
          follower_id: currentUser.id,
          following_id: userId
        })

      if (error) throw error
      return { isFollowing: true }
    }
  }

  // Search methods
  async searchUsers(query: string) {
    const { data, error } = await this.supabase
      .from('users')
      .select('*')
      .or(`first_name.ilike.%${query}%,last_name.ilike.%${query}%,email.ilike.%${query}%`)
      .eq('is_active', true)
      .limit(20)

    if (error) throw error
    return data
  }
}

export const supabaseService = new SupabaseService()