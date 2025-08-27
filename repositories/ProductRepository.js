const Product = require('../models/Product');
const { query } = require('../db/connection');

class ProductRepository {
  constructor() {
    this.model = Product;
  }

  /**
   * Get all products with filtering and pagination
   */
  async findAll(options = {}) {
    return await this.model.findAll(options);
  }

  /**
   * Get product by ID
   */
  async findById(id) {
    return await this.model.findById(id);
  }

  /**
   * Get product by SKU
   */
  async findBySku(sku) {
    return await this.model.findBySku(sku);
  }

  /**
   * Get featured products
   */
  async getFeatured(limit = 10) {
    return await this.model.findFeatured(limit);
  }

  /**
   * Get bestselling products
   */
  async getBestsellers(limit = 10) {
    return await this.model.findBestsellers(limit);
  }

  /**
   * Get new products
   */
  async getNew(limit = 10) {
    return await this.model.findNew(limit);
  }

  /**
   * Search products
   */
  async search(searchTerm, options = {}) {
    return await this.model.search(searchTerm, options);
  }

  /**
   * Get products by category
   */
  async getByCategory(categoryName, options = {}) {
    return await this.model.findByCategory(categoryName, options);
  }

  /**
   * Get related products
   */
  async getRelated(productId, limit = 4) {
    return await this.model.getRelated(productId, limit);
  }

  /**
   * Create new product
   */
  async create(productData) {
    return await this.model.create(productData);
  }

  /**
   * Update product
   */
  async update(id, updateData) {
    const product = await this.findById(id);
    if (!product) {
      throw new Error('Product not found');
    }
    return await product.update(updateData);
  }

  /**
   * Delete product (soft delete)
   */
  async delete(id) {
    const product = await this.findById(id);
    if (!product) {
      throw new Error('Product not found');
    }
    return await product.delete();
  }

  /**
   * Update stock quantity
   */
  async updateStock(id, quantity, operation = 'set') {
    const product = await this.findById(id);
    if (!product) {
      throw new Error('Product not found');
    }
    return await product.updateStock(quantity, operation);
  }

  /**
   * Get products with low stock
   */
  async getLowStock(threshold = null) {
    const sql = `
      SELECT p.*, c.name as category_name, b.name as brand_name
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      LEFT JOIN brands b ON p.brand_id = b.id
      WHERE p.is_active = true 
        AND p.manage_stock = true 
        AND p.stock_quantity <= ${threshold ? '$1' : 'p.low_stock_threshold'}
      ORDER BY p.stock_quantity ASC
    `;

    const params = threshold ? [threshold] : [];
    const result = await query(sql, params);
    return result.rows.map(row => new Product(row));
  }

  /**
   * Get out of stock products
   */
  async getOutOfStock() {
    const sql = `
      SELECT p.*, c.name as category_name, b.name as brand_name
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      LEFT JOIN brands b ON p.brand_id = b.id
      WHERE p.is_active = true 
        AND p.manage_stock = true 
        AND p.stock_quantity = 0
      ORDER BY p.name
    `;

    const result = await query(sql);
    return result.rows.map(row => new Product(row));
  }

  /**
   * Get product analytics
   */
  async getAnalytics(productId, options = {}) {
    const { dateFrom, dateTo, eventType } = options;

    let whereConditions = ['product_id = $1'];
    let params = [productId];
    let paramIndex = 2;

    if (dateFrom) {
      whereConditions.push(`created_at >= $${paramIndex++}`);
      params.push(dateFrom);
    }

    if (dateTo) {
      whereConditions.push(`created_at <= $${paramIndex++}`);
      params.push(dateTo);
    }

    if (eventType) {
      whereConditions.push(`event_type = $${paramIndex++}`);
      params.push(eventType);
    }

    const whereClause = `WHERE ${whereConditions.join(' AND ')}`;

    const sql = `
      SELECT 
        event_type,
        COUNT(*) as event_count,
        COUNT(DISTINCT user_id) as unique_users,
        DATE(created_at) as event_date
      FROM product_analytics 
      ${whereClause}
      GROUP BY event_type, DATE(created_at)
      ORDER BY event_date DESC, event_type
    `;

    const result = await query(sql, params);
    return result.rows;
  }

  /**
   * Track product event
   */
  async trackEvent(productId, eventType, metadata = {}) {
    const { userId, sessionId, ipAddress, userAgent, referrer } = metadata;

    const sql = `
      INSERT INTO product_analytics (
        product_id, event_type, user_id, session_id, ip_address, user_agent, referrer, metadata
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *
    `;

    const params = [
      productId, eventType, userId, sessionId, ipAddress, userAgent, referrer, 
      JSON.stringify(metadata)
    ];

    const result = await query(sql, params);
    return result.rows[0];
  }

  /**
   * Get trending products based on analytics
   */
  async getTrending(options = {}) {
    const { limit = 10, days = 7, eventType = 'view' } = options;

    const sql = `
      SELECT 
        p.*,
        c.name as category_name,
        b.name as brand_name,
        COUNT(pa.id) as event_count,
        pi.image_url as primary_image
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      LEFT JOIN brands b ON p.brand_id = b.id
      LEFT JOIN product_images pi ON p.id = pi.product_id AND pi.is_primary = true
      JOIN product_analytics pa ON p.id = pa.product_id
      WHERE p.is_active = true 
        AND pa.event_type = $1 
        AND pa.created_at >= NOW() - INTERVAL '${days} days'
      GROUP BY p.id, c.name, b.name, pi.image_url
      ORDER BY event_count DESC
      LIMIT $2
    `;

    const result = await query(sql, [eventType, limit]);
    return result.rows.map(row => new Product(row));
  }

  /**
   * Get product recommendations based on user behavior
   */
  async getRecommendations(userId, options = {}) {
    const { limit = 10, excludeProductId } = options;

    let excludeClause = '';
    let params = [userId, limit];
    
    if (excludeProductId) {
      excludeClause = 'AND p.id != $3';
      params.push(excludeProductId);
    }

    const sql = `
      WITH user_categories AS (
        SELECT DISTINCT p.category_id, COUNT(*) as interaction_count
        FROM product_analytics pa
        JOIN products p ON pa.product_id = p.id
        WHERE pa.user_id = $1 AND pa.created_at >= NOW() - INTERVAL '30 days'
        GROUP BY p.category_id
        ORDER BY interaction_count DESC
        LIMIT 3
      )
      SELECT DISTINCT
        p.*,
        c.name as category_name,
        b.name as brand_name,
        pi.image_url as primary_image,
        COALESCE(AVG(r.rating), 0) as avg_rating,
        COUNT(DISTINCT r.id) as review_count
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      LEFT JOIN brands b ON p.brand_id = b.id
      LEFT JOIN product_images pi ON p.id = pi.product_id AND pi.is_primary = true
      LEFT JOIN reviews r ON p.id = r.product_id AND r.is_approved = true
      JOIN user_categories uc ON p.category_id = uc.category_id
      WHERE p.is_active = true 
        AND p.stock_quantity > 0
        ${excludeClause}
      GROUP BY p.id, c.name, b.name, pi.image_url, uc.interaction_count
      ORDER BY uc.interaction_count DESC, p.is_featured DESC, RANDOM()
      LIMIT $2
    `;

    const result = await query(sql, params);
    return result.rows.map(row => new Product(row));
  }

  /**
   * Bulk update products
   */
  async bulkUpdate(updates) {
    if (!Array.isArray(updates) || updates.length === 0) {
      throw new Error('Updates must be a non-empty array');
    }

    const client = await query.pool.connect();

    try {
      await client.query('BEGIN');

      const results = [];
      for (const { id, data } of updates) {
        const product = await this.findById(id);
        if (product) {
          const updated = await product.update(data);
          results.push(updated);
        }
      }

      await client.query('COMMIT');
      return results;

    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  /**
   * Get product statistics
   */
  async getStats() {
    const sql = `
      SELECT 
        COUNT(*) as total_products,
        COUNT(CASE WHEN is_active = true THEN 1 END) as active_products,
        COUNT(CASE WHEN is_featured = true THEN 1 END) as featured_products,
        COUNT(CASE WHEN is_bestseller = true THEN 1 END) as bestseller_products,
        COUNT(CASE WHEN is_new = true THEN 1 END) as new_products,
        COUNT(CASE WHEN stock_quantity = 0 THEN 1 END) as out_of_stock,
        COUNT(CASE WHEN stock_quantity <= low_stock_threshold THEN 1 END) as low_stock,
        AVG(price) as average_price,
        MIN(price) as min_price,
        MAX(price) as max_price,
        SUM(stock_quantity) as total_stock_value
      FROM products
    `;

    const result = await query(sql);
    const stats = result.rows[0];

    return {
      totalProducts: parseInt(stats.total_products),
      activeProducts: parseInt(stats.active_products),
      featuredProducts: parseInt(stats.featured_products),
      bestsellerProducts: parseInt(stats.bestseller_products),
      newProducts: parseInt(stats.new_products),
      outOfStock: parseInt(stats.out_of_stock),
      lowStock: parseInt(stats.low_stock),
      averagePrice: parseFloat(stats.average_price) || 0,
      minPrice: parseFloat(stats.min_price) || 0,
      maxPrice: parseFloat(stats.max_price) || 0,
      totalStockValue: parseInt(stats.total_stock_value) || 0
    };
  }
}

module.exports = ProductRepository;