/**
 * LoginPage - Authentication Page
 * Premium login experience with guest guard
 */

import React from 'react'
import { LoginForm, GuestGuard } from '@/features/auth'

export function LoginPage() {
  return (
    <GuestGuard>
      <LoginForm />
    </GuestGuard>
  )
}