"use client"

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'

interface WelcomePopupProps {
  isOpen: boolean
  onClose: () => void
  userName?: string
  userEmail?: string
}

export const WelcomePopup = ({ isOpen, onClose, userName, userEmail }: WelcomePopupProps) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            onClick={onClose}
          />
          
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 50 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="fixed inset-0 flex items-center justify-center z-50 p-4"
          >
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-lg w-full relative border">
              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 z-10 p-2 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              
              {/* Content */}
              <div className="p-8">
                {/* Welcome Message */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-center space-y-4"
                >
                  <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                    🎉 Welcome to Vibely{userName ? `, ${userName}` : ''}!
                  </h1>
                  
                  <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                    You've successfully signed in{userEmail ? ` with ${userEmail}` : ''}. Explore the amazing features below!
                  </p>
                </motion.div>

                {/* Get Started Button */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="text-center mt-8"
                >
                  <button
                    onClick={onClose}
                    className="bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold py-3 px-8 rounded-xl text-lg hover:scale-105 transition-transform duration-200 shadow-lg"
                  >
                    Get Started
                  </button>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}