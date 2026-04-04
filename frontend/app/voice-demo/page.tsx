'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { VoiceWelcome, VoiceWelcomeCompact } from '@/components/ui/voice-welcome'
import { ProfileAvatar } from '@/components/ui/profile-avatar'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Volume2, Users, MessageSquare, Settings } from 'lucide-react'
import Link from 'next/link'

export default function VoiceDemoPage() {
  const [selectedProfile, setSelectedProfile] = useState('alice')

  const demoProfiles = [
    {
      id: 'alice',
      firstName: 'Alice',
      lastName: 'Johnson',
      role: 'Designer',
      description: 'Creative designer with a passion for user experience'
    },
    {
      id: 'bob',
      firstName: 'Bob',
      lastName: 'Smith',
      role: 'Developer',
      description: 'Full-stack developer building amazing web experiences'
    },
    {
      id: 'carol',
      firstName: 'Carol',
      lastName: 'Davis',
      role: 'Manager',
      description: 'Product manager focused on user-centered solutions'
    }
  ]

  const currentProfile = demoProfiles.find(p => p.id === selectedProfile) || demoProfiles[0]

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/hero" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-purple-600 rounded-md flex items-center justify-center text-white font-bold">
                  V
                </div>
                <span className="font-semibold text-lg">Vibely</span>
              </Link>
              <Badge variant="secondary" className="bg-purple-100 text-purple-700">
                <Volume2 className="w-3 h-3 mr-1" />
                Voice Demo
              </Badge>
            </div>
            <Link href="/hero">
              <Button variant="outline">Back to Dashboard</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-6 py-8">
        {/* Title Section */}
        <div className="text-center mb-12">
          <motion.h1 
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-4xl font-bold text-gray-900 mb-4"
          >
            🤖 Voice Welcome Demo
          </motion.h1>
          <motion.p 
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-lg text-gray-600 max-w-2xl mx-auto"
          >
            Experience how our robot assistants welcome visitors to profiles with personalized voice messages. 
            Click on different profiles to hear unique welcome messages!
          </motion.p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Selection */}
          <div className="lg:col-span-1">
            <Card className="p-6">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Users className="w-5 h-5" />
                Select Profile to Visit
              </h3>
              <div className="space-y-3">
                {demoProfiles.map((profile) => (
                  <motion.div
                    key={profile.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSelectedProfile(profile.id)}
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                      selectedProfile === profile.id
                        ? 'border-purple-300 bg-purple-50'
                        : 'border-gray-200 hover:border-purple-200 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <ProfileAvatar
                        userId={profile.id}
                        firstName={profile.firstName}
                        lastName={profile.lastName}
                        size="sm"
                      />
                      <div className="flex-1">
                        <div className="font-medium text-gray-900">
                          {profile.firstName} {profile.lastName}
                        </div>
                        <div className="text-sm text-gray-500">{profile.role}</div>
                      </div>
                    </div>
                    <p className="text-xs text-gray-600 mt-2 ml-11">
                      {profile.description}
                    </p>
                  </motion.div>
                ))}
              </div>
            </Card>

            {/* Voice Controls Info */}
            <Card className="p-6 mt-6 bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
              <h3 className="font-semibold text-purple-900 mb-3 flex items-center gap-2">
                <Settings className="w-5 h-5" />
                Voice Controls
              </h3>
              <div className="space-y-2 text-sm text-purple-700">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                  <span>Click the voice button to play welcome</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                  <span>Click again to stop speaking</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                  <span>Hover for extended controls</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                  <span>Auto-plays when visiting profiles</span>
                </div>
              </div>
            </Card>
          </div>

          {/* Main Demo Area */}
          <div className="lg:col-span-2">
            <Card className="p-0 overflow-hidden">
              {/* Profile Header */}
              <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <ProfileAvatar
                      userId={currentProfile.id}
                      firstName={currentProfile.firstName}
                      lastName={currentProfile.lastName}
                      size="lg"
                    />
                    <div>
                      <h2 className="text-2xl font-bold">
                        {currentProfile.firstName} {currentProfile.lastName}
                      </h2>
                      <p className="text-purple-100">{currentProfile.role}</p>
                    </div>
                  </div>
                  
                  {/* Main Voice Welcome */}
                  <VoiceWelcome
                    profileOwnerName={`${currentProfile.firstName} ${currentProfile.lastName}`}
                    visitorName="Demo User"
                    customMessage={`Hello! Welcome to ${currentProfile.firstName}'s profile.`}
                    size="lg"
                    showControls={true}
                    className="drop-shadow-lg"
                  />
                </div>
              </div>

              {/* Profile Content */}
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* About Section */}
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">About {currentProfile.firstName}</h3>
                    <p className="text-gray-600 text-sm leading-relaxed mb-4">
                      {currentProfile.description}. This profile demonstrates how the robot assistant 
                      welcomes visitors with personalized voice messages.
                    </p>
                    
                    {/* Compact Voice Welcome Example */}
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-700">Compact Voice Control</span>
                        <VoiceWelcomeCompact
                          profileOwnerName={`${currentProfile.firstName} ${currentProfile.lastName}`}
                          customMessage={`Welcome to ${currentProfile.firstName}'s profile!`}
                        />
                      </div>
                      <p className="text-xs text-gray-500">
                        This compact version can be used in smaller UI elements like cards or lists.
                      </p>
                    </div>
                  </div>

                  {/* Features Section */}
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">Voice Features</h3>
                    <div className="space-y-3">
                      <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                        <div className="w-2 h-2 bg-green-400 rounded-full mt-2"></div>
                        <div>
                          <div className="font-medium text-green-800 text-sm">Personalized Messages</div>
                          <div className="text-green-600 text-xs">
                            Each profile has unique welcome messages mentioning the visitor's name
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                        <div className="w-2 h-2 bg-blue-400 rounded-full mt-2"></div>
                        <div>
                          <div className="font-medium text-blue-800 text-sm">Robot Voice</div>
                          <div className="text-blue-600 text-xs">
                            Uses synthetic voices optimized for robot-like speech patterns
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-3 p-3 bg-purple-50 rounded-lg">
                        <div className="w-2 h-2 bg-purple-400 rounded-full mt-2"></div>
                        <div>
                          <div className="font-medium text-purple-800 text-sm">Auto-Play</div>
                          <div className="text-purple-600 text-xs">
                            Automatically welcomes visitors when they visit a profile
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="mt-8 flex items-center gap-4">
                  <Link href={`/profile/${currentProfile.id}`}>
                    <Button className="bg-purple-600 hover:bg-purple-700">
                      Visit Full Profile
                    </Button>
                  </Link>
                  <Button variant="outline">
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Send Message
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Instructions */}
        <Card className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
          <h3 className="font-semibold text-blue-900 mb-4">🎯 How to Experience Voice Welcome</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <span className="text-blue-600 font-bold">1</span>
              </div>
              <div className="font-medium text-blue-800">Select Profile</div>
              <div className="text-blue-600">Choose a profile from the left panel</div>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <span className="text-blue-600 font-bold">2</span>
              </div>
              <div className="font-medium text-blue-800">Click Voice Button</div>
              <div className="text-blue-600">Click the voice icon to hear the welcome</div>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <span className="text-blue-600 font-bold">3</span>
              </div>
              <div className="font-medium text-blue-800">Visit Profile</div>
              <div className="text-blue-600">Visit the full profile for auto-play experience</div>
            </div>
          </div>
        </Card>
      </main>
    </div>
  )
}