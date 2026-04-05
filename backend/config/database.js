const mongoose = require('mongoose');
const { Pool } = require('pg');

class DatabaseManager {
  constructor() {
    this.mongoConnection = null;
    this.pgPool = null;
    this.dbType = process.env.DATABASE_TYPE || 'mongodb'; // 'mongodb' or 'postgresql'
  }

  async connect() {
    if (this.dbType === 'postgresql') {
      return this.connectPostgreSQL();
    } else {
      return this.connectMongoDB();
    }
  }

  async connectMongoDB() {
    try {
      const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/vibely';
      await mongoose.connect(mongoUri);
      this.mongoConnection = mongoose.connection;
      console.log('✅ Connected to MongoDB');
      return this.mongoConnection;
    } catch (error) {
      console.error('❌ MongoDB connection error:', error);
      throw error;
    }
  }

  async connectPostgreSQL() {
    try {
      this.pgPool = new Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
      });

      // Test the connection
      const client = await this.pgPool.connect();
      console.log('✅ Connected to PostgreSQL (Supabase)');
      client.release();
      return this.pgPool;
    } catch (error) {
      console.error('❌ PostgreSQL connection error:', error);
      throw error;
    }
  }

  getConnection() {
    return this.dbType === 'postgresql' ? this.pgPool : this.mongoConnection;
  }

  async disconnect() {
    if (this.dbType === 'postgresql' && this.pgPool) {
      await this.pgPool.end();
    } else if (this.mongoConnection) {
      await mongoose.disconnect();
    }
  }
}

module.exports = new DatabaseManager();