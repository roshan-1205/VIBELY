/**
 * Optimistic Updates Hook - Instant UI Feedback
 * Update UI immediately, rollback on error
 */

import { useState, useCallback, useRef } from 'react'

interface OptimisticUpdate<T> {
  id: string
  optimisticData: T
  rollbackData: T
  timestamp: number
}

export function useOptimisticUpdates<T>() {
  const [optimisticUpdates, setOptimisticUpdates] = useState<Map<string, OptimisticUpdate<T>>>(new Map())
  const timeoutRefs = useRef<Map<string, NodeJS.Timeout>>(new Map())

  // Add optimistic update
  const addOptimisticUpdate = useCallback((
    id: string,
    optimisticData: T,
    rollbackData: T,
    autoRollbackMs?: number
  ) => {
    const update: OptimisticUpdate<T> = {
      id,
      optimisticData,
      rollbackData,
      timestamp: Date.now(),
    }

    setOptimisticUpdates(prev => new Map(prev).set(id, update))

    // Auto rollback after timeout
    if (autoRollbackMs) {
      const timeout = setTimeout(() => {
        rollbackUpdate(id)
      }, autoRollbackMs)
      
      timeoutRefs.current.set(id, timeout)
    }
  }, [])

  // Confirm optimistic update (remove from pending)
  const confirmUpdate = useCallback((id: string) => {
    setOptimisticUpdates(prev => {
      const next = new Map(prev)
      next.delete(id)
      return next
    })

    // Clear timeout
    const timeout = timeoutRefs.current.get(id)
    if (timeout) {
      clearTimeout(timeout)
      timeoutRefs.current.delete(id)
    }
  }, [])

  // Rollback optimistic update
  const rollbackUpdate = useCallback((id: string) => {
    setOptimisticUpdates(prev => {
      const next = new Map(prev)
      next.delete(id)
      return next
    })

    // Clear timeout
    const timeout = timeoutRefs.current.get(id)
    if (timeout) {
      clearTimeout(timeout)
      timeoutRefs.current.delete(id)
    }
  }, [])

  // Get current data with optimistic updates applied
  const getOptimisticData = useCallback((id: string, fallbackData: T): T => {
    const update = optimisticUpdates.get(id)
    return update ? update.optimisticData : fallbackData
  }, [optimisticUpdates])

  // Check if update is pending
  const isPending = useCallback((id: string): boolean => {
    return optimisticUpdates.has(id)
  }, [optimisticUpdates])

  // Clear all updates
  const clearAll = useCallback(() => {
    // Clear all timeouts
    timeoutRefs.current.forEach(timeout => clearTimeout(timeout))
    timeoutRefs.current.clear()
    
    setOptimisticUpdates(new Map())
  }, [])

  return {
    addOptimisticUpdate,
    confirmUpdate,
    rollbackUpdate,
    getOptimisticData,
    isPending,
    clearAll,
    pendingUpdates: Array.from(optimisticUpdates.values()),
  }
}

/**
 * Optimistic like hook - for social media interactions
 */
export function useOptimisticLike() {
  const {
    addOptimisticUpdate,
    confirmUpdate,
    rollbackUpdate,
    getOptimisticData,
    isPending,
  } = useOptimisticUpdates<{ isLiked: boolean; likesCount: number }>()

  const optimisticLike = useCallback(async (
    postId: string,
    currentData: { isLiked: boolean; likesCount: number },
    likeAction: () => Promise<void>
  ) => {
    // Optimistic update
    const optimisticData = {
      isLiked: !currentData.isLiked,
      likesCount: currentData.isLiked 
        ? currentData.likesCount - 1 
        : currentData.likesCount + 1,
    }

    addOptimisticUpdate(postId, optimisticData, currentData, 5000) // 5s auto-rollback

    try {
      await likeAction()
      confirmUpdate(postId)
    } catch (error) {
      rollbackUpdate(postId)
      throw error
    }
  }, [addOptimisticUpdate, confirmUpdate, rollbackUpdate])

  return {
    optimisticLike,
    getOptimisticData,
    isPending,
  }
}