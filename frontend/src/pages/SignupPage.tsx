/**
 * SignupPage - Registration Page
 * Premium signup experience with guest guard
 */

import React from 'react'
import { SignupForm, GuestGuard } from '@/features/auth'

export function SignupPage() {
  return (
    <GuestGuard>
      <SignupForm />
    </GuestGuard>
  )
}