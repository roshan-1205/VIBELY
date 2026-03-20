/**
 * Virtualization Hook - Optimize Large Lists
 * Only render visible items for better performance
 */

import { useState, useEffect, useCallback, useMemo } from 'react'

interface VirtualizationOptions {
  itemHeight: number
  containerHeight: number
  overscan?: number // Extra items to render outside viewport
  scrollElement?: HTMLElement | null
}

interface VirtualItem {
  index: number
  start: number
  end: number
  size: number
}

export function useVirtualization<T>({
  items,
  itemHeight,
  containerHeight,
  overscan = 5,
  scrollElement,
}: VirtualizationOptions & { items: T[] }) {
  const [scrollTop, setScrollTop] = useState(0)

  // Calculate visible range
  const visibleRange = useMemo(() => {
    const startIndex = Math.floor(scrollTop / itemHeight)
    const endIndex = Math.min(
      startIndex + Math.ceil(containerHeight / itemHeight),
      items.length - 1
    )

    return {
      start: Math.max(0, startIndex - overscan),
      end: Math.min(items.length - 1, endIndex + overscan),
    }
  }, [scrollTop, itemHeight, containerHeight, items.length, overscan])

  // Generate virtual items
  const virtualItems = useMemo(() => {
    const result: VirtualItem[] = []
    
    for (let i = visibleRange.start; i <= visibleRange.end; i++) {
      result.push({
        index: i,
        start: i * itemHeight,
        end: (i + 1) * itemHeight,
        size: itemHeight,
      })
    }
    
    return result
  }, [visibleRange, itemHeight])

  // Handle scroll
  const handleScroll = useCallback((e: Event) => {
    const target = e.target as HTMLElement
    setScrollTop(target.scrollTop)
  }, [])

  // Set up scroll listener
  useEffect(() => {
    const element = scrollElement || window
    element.addEventListener('scroll', handleScroll, { passive: true })
    
    return () => {
      element.removeEventListener('scroll', handleScroll)
    }
  }, [scrollElement, handleScroll])

  // Total height for scrollbar
  const totalHeight = items.length * itemHeight

  // Offset for positioning
  const offsetY = visibleRange.start * itemHeight

  return {
    virtualItems,
    totalHeight,
    offsetY,
    visibleRange,
  }
}

/**
 * Infinite scroll hook with virtualization
 */
export function useInfiniteVirtualScroll<T>({
  items,
  itemHeight,
  containerHeight,
  hasNextPage,
  isFetchingNextPage,
  fetchNextPage,
  threshold = 5, // Items from bottom to trigger load
}: VirtualizationOptions & {
  items: T[]
  hasNextPage: boolean
  isFetchingNextPage: boolean
  fetchNextPage: () => void
  threshold?: number
}) {
  const virtualization = useVirtualization({
    items,
    itemHeight,
    containerHeight,
  })

  // Check if we need to load more
  useEffect(() => {
    const { end } = virtualization.visibleRange
    const shouldLoadMore = 
      hasNextPage && 
      !isFetchingNextPage && 
      end >= items.length - threshold

    if (shouldLoadMore) {
      fetchNextPage()
    }
  }, [
    virtualization.visibleRange,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
    items.length,
    threshold,
  ])

  return virtualization
}