const { Pool } = require('pg');

// Database configuration for PostgreSQL
const dbConfig = {
  user: process.env.DB_USER || 'smartcartia_user',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'smartcartia_db',
  password: process.env.DB_PASSWORD || 'smartcartia_password',
  port: process.env.DB_PORT || 5432,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  // Connection pool settings
  max: 20, // Maximum number of clients in the pool
  idleTimeoutMillis: 30000, // How long a client is allowed to remain idle
  connectionTimeoutMillis: 2000, // How long to wait when connecting
  maxUses: 7500, // Maximum number of times a client can be used before being discarded
};

// Create the connection pool
const pool = new Pool(dbConfig);

// Handle pool errors
pool.on('error', (err, client) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});

// Test database connection
const testConnection = async () => {
  try {
    const client = await pool.connect();
    console.log('✅ Database connected successfully');
    client.release();
    return true;
  } catch (err) {
    console.error('❌ Database connection failed:', err.message);
    return false;
  }
};

module.exports = {
  pool,
  testConnection,
  dbConfig
};