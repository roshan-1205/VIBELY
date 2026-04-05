const { Pool } = require('pg');

async function setupDatabase() {
  console.log('🚀 Setting up Supabase Database Schema...\n');

  // Connection string with your password
  const connectionString = 'postgresql://postgres.xmziootltbhwxmigvqhv:Rs%409826348254@aws-0-ap-south-1.pooler.supabase.com:6543/postgres';
  
  const pool = new Pool({
    connectionString,
    ssl: { rejectUnauthorized: false }
  });

  try {
    const client = await pool.connect();
    console.log('✅ Connected to Supabase PostgreSQL');

    // Create users table
    console.log('📝 Creating users table...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        first_name VARCHAR(100) NOT NULL,
        last_name VARCHAR(100) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255),
        avatar TEXT,
        bio TEXT,
        location VARCHAR(255),
        phone VARCHAR(20),
        coordinates JSONB,
        website VARCHAR(255),
        is_email_verified BOOLEAN DEFAULT FALSE,
        is_online BOOLEAN DEFAULT FALSE,
        last_seen TIMESTAMP WITH TIME ZONE,
        last_login TIMESTAMP WITH TIME ZONE,
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);
    console.log('✅ Users table created');

    // Create posts table
    console.log('📝 Creating posts table...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS posts (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        author_id UUID REFERENCES users(id) ON DELETE CASCADE,
        content TEXT NOT NULL,
        media_urls TEXT[],
        media_type VARCHAR(20) DEFAULT 'text',
        location VARCHAR(255),
        coordinates JSONB,
        is_public BOOLEAN DEFAULT TRUE,
        likes_count INTEGER DEFAULT 0,
        comments_count INTEGER DEFAULT 0,
        shares_count INTEGER DEFAULT 0,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);
    console.log('✅ Posts table created');

    // Create follows table
    console.log('📝 Creating follows table...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS follows (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        follower_id UUID REFERENCES users(id) ON DELETE CASCADE,
        following_id UUID REFERENCES users(id) ON DELETE CASCADE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        UNIQUE(follower_id, following_id)
      );
    `);
    console.log('✅ Follows table created');

    // Create likes table
    console.log('📝 Creating likes table...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS likes (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID REFERENCES users(id) ON DELETE CASCADE,
        post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        UNIQUE(user_id, post_id)
      );
    `);
    console.log('✅ Likes table created');

    // Create comments table
    console.log('📝 Creating comments table...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS comments (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
        user_id UUID REFERENCES users(id) ON DELETE CASCADE,
        content TEXT NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);
    console.log('✅ Comments table created');

    // Create notifications table
    console.log('📝 Creating notifications table...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS notifications (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        recipient_id UUID REFERENCES users(id) ON DELETE CASCADE,
        sender_id UUID REFERENCES users(id) ON DELETE CASCADE,
        type VARCHAR(50) NOT NULL,
        message TEXT NOT NULL,
        target_post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
        is_read BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);
    console.log('✅ Notifications table created');

    // Create messages table
    console.log('📝 Creating messages table...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS messages (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        sender_id UUID REFERENCES users(id) ON DELETE CASCADE,
        recipient_id UUID REFERENCES users(id) ON DELETE CASCADE,
        content TEXT NOT NULL,
        message_type VARCHAR(20) DEFAULT 'text',
        is_read BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);
    console.log('✅ Messages table created');

    // Create activities table
    console.log('📝 Creating activities table...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS activities (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID REFERENCES users(id) ON DELETE CASCADE,
        type VARCHAR(50) NOT NULL,
        description TEXT NOT NULL,
        target_id UUID,
        target_type VARCHAR(50),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);
    console.log('✅ Activities table created');

    // Create indexes
    console.log('📝 Creating indexes...');
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
      CREATE INDEX IF NOT EXISTS idx_posts_author_id ON posts(author_id);
      CREATE INDEX IF NOT EXISTS idx_posts_created_at ON posts(created_at DESC);
      CREATE INDEX IF NOT EXISTS idx_follows_follower_id ON follows(follower_id);
      CREATE INDEX IF NOT EXISTS idx_follows_following_id ON follows(following_id);
      CREATE INDEX IF NOT EXISTS idx_likes_post_id ON likes(post_id);
      CREATE INDEX IF NOT EXISTS idx_likes_user_id ON likes(user_id);
      CREATE INDEX IF NOT EXISTS idx_comments_post_id ON comments(post_id);
      CREATE INDEX IF NOT EXISTS idx_notifications_recipient_id ON notifications(recipient_id);
      CREATE INDEX IF NOT EXISTS idx_messages_sender_id ON messages(sender_id);
      CREATE INDEX IF NOT EXISTS idx_messages_recipient_id ON messages(recipient_id);
      CREATE INDEX IF NOT EXISTS idx_activities_user_id ON activities(user_id);
    `);
    console.log('✅ Indexes created');

    client.release();
    await pool.end();

    console.log('\n🎉 Database setup completed successfully!');
    console.log('\n📋 Connection Details:');
    console.log('URL: https://xmziootltbhwxmigvqhv.supabase.co');
    console.log('Database: PostgreSQL');
    console.log('Region: Mumbai (ap-south-1)');
    console.log('Connection String: postgresql://postgres.xmziootltbhwxmigvqhv:Rs%409826348254@aws-0-ap-south-1.pooler.supabase.com:6543/postgres');
    
  } catch (error) {
    console.error('❌ Database setup failed:', error);
  }
}

// Run setup
setupDatabase();