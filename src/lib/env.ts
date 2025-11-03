// Environment variable validation and configuration

interface EnvConfig {
  // Supabase
  supabaseUrl: string;
  supabaseAnonKey: string;
  supabaseServiceKey?: string;
  
  // OpenAI
  openaiApiKey: string;
  
  // Judge0
  judge0ApiUrl: string;
  judge0ApiKey: string;
  
  // Next.js
  nextAuthUrl?: string;
  nextAuthSecret?: string;
  
  // Optional
  databaseUrl?: string;
  redisUrl?: string;
  uploadMaxSize?: number;
  allowedFileTypes?: string[];
}

/**
 * Validate and get environment variables
 */
export function getEnvConfig(): EnvConfig {
  const requiredVars = {
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
    supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    openaiApiKey: process.env.OPENAI_API_KEY,
  };

  const optionalVars = {
    judge0ApiUrl: process.env.JUDGE0_API_URL,
    judge0ApiKey: process.env.JUDGE0_API_KEY,
  };

  // Check required variables
  const missingVars: string[] = [];
  for (const [key, value] of Object.entries(requiredVars)) {
    if (!value) {
      missingVars.push(key);
    }
  }

  // For development, provide helpful error message instead of crashing
  if (missingVars.length > 0) {
    console.warn('⚠️ Missing environment variables:', missingVars.join(', '));
    console.warn('📝 Please create a .env.local file with the required variables.');
    console.warn('📖 See ENVIRONMENT_SETUP.md for detailed instructions.');
    
    // In development, provide fallback values to prevent crashes
    if (process.env.NODE_ENV === 'development') {
      console.warn('🔧 Using fallback values for development...');
      return {
        supabaseUrl: requiredVars.supabaseUrl || 'https://placeholder.supabase.co',
        supabaseAnonKey: requiredVars.supabaseAnonKey || 'placeholder_key',
        openaiApiKey: requiredVars.openaiApiKey || 'placeholder_key',
        judge0ApiUrl: optionalVars.judge0ApiUrl || 'https://judge0-ce.p.rapidapi.com',
        judge0ApiKey: optionalVars.judge0ApiKey || 'placeholder_key',
        supabaseServiceKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
        nextAuthUrl: process.env.NEXTAUTH_URL,
        nextAuthSecret: process.env.NEXTAUTH_SECRET,
        databaseUrl: process.env.DATABASE_URL,
        redisUrl: process.env.REDIS_URL,
        uploadMaxSize: process.env.UPLOAD_MAX_SIZE ? parseInt(process.env.UPLOAD_MAX_SIZE) : 10485760,
        allowedFileTypes: process.env.ALLOWED_FILE_TYPES?.split(',') || [
          'image/jpeg',
          'image/png', 
          'image/gif',
          'application/pdf'
        ],
      };
    }
    
    // In production, still throw error
    throw new Error(
      `Missing required environment variables: ${missingVars.join(', ')}\n` +
      'Please check your .env.local file and ensure all required variables are set.'
    );
  }

  // Warn about optional Judge0 variables if missing
  if (!optionalVars.judge0ApiUrl || !optionalVars.judge0ApiKey) {
    console.warn('ℹ️ Judge0 API credentials not set. Code execution features will be disabled.');
  }

  return {
    supabaseUrl: requiredVars.supabaseUrl!,
    supabaseAnonKey: requiredVars.supabaseAnonKey!,
    openaiApiKey: requiredVars.openaiApiKey!,
    judge0ApiUrl: optionalVars.judge0ApiUrl || '',
    judge0ApiKey: optionalVars.judge0ApiKey || '',
    supabaseServiceKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
    nextAuthUrl: process.env.NEXTAUTH_URL,
    nextAuthSecret: process.env.NEXTAUTH_SECRET,
    databaseUrl: process.env.DATABASE_URL,
    redisUrl: process.env.REDIS_URL,
    uploadMaxSize: process.env.UPLOAD_MAX_SIZE ? parseInt(process.env.UPLOAD_MAX_SIZE) : 10485760, // 10MB default
    allowedFileTypes: process.env.ALLOWED_FILE_TYPES?.split(',') || [
      'image/jpeg',
      'image/png', 
      'image/gif',
      'application/pdf'
    ],
  };
}

/**
 * Validate environment variables on app startup
 */
export function validateEnvironment(): void {
  try {
    getEnvConfig();
    console.log(' Environment variables validated successfully');
  } catch (error) {
    console.error(' Environment validation failed:', error);
    throw error;
  }
}

/**
 * Get environment-specific configuration
 */
export function getEnvironmentConfig() {
  const isDevelopment = process.env.NODE_ENV === 'development';
  const isProduction = process.env.NODE_ENV === 'production';
  const isTest = process.env.NODE_ENV === 'test';

  return {
    isDevelopment,
    isProduction,
    isTest,
    apiUrl: isDevelopment ? 'http://localhost:3000' : process.env.NEXTAUTH_URL,
    logLevel: isDevelopment ? 'debug' : 'info',
    enableAnalytics: isProduction,
  };
}

// Export the validated config
export const env = getEnvConfig();
export const environment = getEnvironmentConfig();
