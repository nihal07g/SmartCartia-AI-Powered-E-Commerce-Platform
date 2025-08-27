const { pool } = require('./config');

/**
 * Execute a query with parameters
 * @param {string} text - SQL query
 * @param {Array} params - Query parameters
 * @returns {Promise} Query result
 */
const query = async (text, params = []) => {
  const start = Date.now();
  const client = await pool.connect();
  
  try {
    const result = await client.query(text, params);
    const duration = Date.now() - start;
    
    // Log query performance in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`🔍 Query executed in ${duration}ms`);
    }
    
    return result;
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  } finally {
    client.release();
  }
};

/**
 * Execute multiple queries in a transaction
 * @param {Function} callback - Function containing queries to execute
 * @returns {Promise} Transaction result
 */
const transaction = async (callback) => {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    const result = await callback(client);
    await client.query('COMMIT');
    return result;
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Transaction error:', error);
    throw error;
  } finally {
    client.release();
  }
};

/**
 * Get database connection pool status
 * @returns {Object} Pool status information
 */
const getPoolStatus = () => {
  return {
    totalCount: pool.totalCount,
    idleCount: pool.idleCount,
    waitingCount: pool.waitingCount
  };
};

/**
 * Close all database connections
 */
const closePool = async () => {
  try {
    await pool.end();
    console.log('📫 Database pool closed');
  } catch (error) {
    console.error('Error closing database pool:', error);
  }
};

module.exports = {
  query,
  transaction,
  getPoolStatus,
  closePool,
  pool
};