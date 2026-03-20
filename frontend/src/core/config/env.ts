/**
 * Environment configuration
 * Centralized environment variable management
 */

interface EnvConfig {
  // API Configuration
  API_URL: string
  SOCKET_URL: string
  
  // App Configuration
  APP_NAME: string
  APP_VERSION: string
  
  // Feature Flags
  ENABLE_ANALYTICS: boolean
  ENABLE_SENTRY: boolean
  ENABLE_WEBSOCKETS: boolean
  
  // External Services
  SENTRY_DSN?: string
  ANALYTICS_ID?: string
  
  // Development
  LOG_LEVEL: string
  IS_DEVELOPMENT: boolean
  IS_PRODUCTION: boolean
}

function getEnvVar(key: string, defaultValue?: string): string {
  const value = import.meta.env[key] || defaultValue
  if (!value && !defaultValue) {
    throw new Error(`Environment variable ${key} is required but not set`)
  }
  return value
}

function getBooleanEnvVar(key: string, defaultValue: boolean = false): boolean {
  const value = import.meta.env[key]
  if (value === undefined) return defaultValue
  return value === 'true' || value === '1'
}

export const ENV: EnvConfig = {
  // API Configuration
  API_URL: getEnvVar('VITE_API_URL', 'http://localhost:8000/api/v1'),
  SOCKET_URL: getEnvVar('VITE_SOCKET_URL', 'ws://localhost:8000'),
  
  // App Configuration
  APP_NAME: getEnvVar('VITE_APP_NAME', 'Vibely'),
  APP_VERSION: getEnvVar('VITE_APP_VERSION', '1.0.0'),
  
  // Feature Flags
  ENABLE_ANALYTICS: getBooleanEnvVar('VITE_ENABLE_ANALYTICS', false),
  ENABLE_SENTRY: getBooleanEnvVar('VITE_ENABLE_SENTRY', false),
  ENABLE_WEBSOCKETS: getBooleanEnvVar('VITE_ENABLE_WEBSOCKETS', true),
  
  // External Services
  SENTRY_DSN: import.meta.env.VITE_SENTRY_DSN,
  ANALYTICS_ID: import.meta.env.VITE_ANALYTICS_ID,
  
  // Development
  LOG_LEVEL: getEnvVar('VITE_LOG_LEVEL', 'info'),
  IS_DEVELOPMENT: import.meta.env.DEV,
  IS_PRODUCTION: import.meta.env.PROD,
}

// Validate required environment variables
export function validateEnv(): void {
  const requiredVars = ['VITE_API_URL']
  
  for (const varName of requiredVars) {
    if (!import.meta.env[varName]) {
      throw new Error(`Required environment variable ${varName} is not set`)
    }
  }
}

// Environment-specific configurations
export const isDevelopment = ENV.IS_DEVELOPMENT
export const isProduction = ENV.IS_PRODUCTION

export default ENV