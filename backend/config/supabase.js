const { createClient } = require('@supabase/supabase-js');

// Supabase configuration
const supabaseUrl = 'https://xmziootltbhwxmigvqhv.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inhtemlvb3RsdGJod3htaWd2cWh2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NTM3NTg4MywiZXhwIjoyMDkwOTUxODgzfQ.zCHVpmyxtznA3GOcMWj_4kv3uhTBH9OX6bFaNIoZ-l4';

// Create Supabase client
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Database connection string for PostgreSQL
const DATABASE_URL = 'postgresql://postgres.xmziootltbhwxmigvqhv:Rs@9826348254@aws-0-ap-south-1.pooler.supabase.com:6543/postgres';

module.exports = {
  supabase,
  supabaseUrl,
  supabaseServiceKey,
  DATABASE_URL
};