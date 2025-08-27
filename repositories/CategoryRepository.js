const Category = require('../models/Category');
const { query } = require('../db/connection');

class CategoryRepository {
  constructor() {
    this.model = Category;
  }

  /**
   * Get all categories with filtering and pagination
   */
  async findAll(options = {}) {
    return await this.model.findAll(options);
  }

  /**
   * Get category by ID
   */
  async findById(id) {
    return await this.model.findById(id);
  }

  /**
   * Get category by name
   */
  async findByName(name) {
    return await this.model.findByName(name);
  }

  /**
   * Get root categories (no parent)
   */
  async getRootCategories() {
    return await this.model.findRootCategories();
  }

  /**
   * Get categories with hierarchy
   */
  async getWithHierarchy() {
    return await this.model.findWithHierarchy();
  }

  /**
   * Create new category
   */
  async create(categoryData) {
    return await this.model.create(categoryData);
  }

  /**
   * Update category
   */
  async update(id, updateData) {
    const category = await this.findById(id);
    if (!category) {
      throw new Error('Category not found');
    }
    return await category.update(updateData);
  }

  /**
   * Delete category
   */
  async delete(id) {
    const category = await this.findById(id);
    if (!category) {
      throw new Error('Category not found');
    }
    return await category.delete();
  }

  /**
   * Activate category
   */
  async activate(id) {
    const category = await this.findById(id);
    if (!category) {
      throw new Error('Category not found');
    }
    return await category.activate();
  }

  /**
   * Deactivate category
   */
  async deactivate(id) {
    const category = await this.findById(id);
    if (!category) {
      throw new Error('Category not found');
    }
    return await category.deactivate();
  }

  /**
   * Get category products
   */
  async getProducts(id, options = {}) {
    const category = await this.findById(id);
    if (!category) {
      throw new Error('Category not found');
    }
    return await category.getProducts(options);
  }

  /**
   * Get category children
   */
  async getChildren(id) {
    const category = await this.findById(id);
    if (!category) {
      throw new Error('Category not found');
    }
    return await category.getChildren();
  }

  /**
   * Get category ancestors
   */
  async getAncestors(id) {
    const category = await this.findById(id);
    if (!category) {
      throw new Error('Category not found');
    }
    return await category.getAncestors();
  }

  /**
   * Get category descendants
   */
  async getDescendants(id) {
    const category = await this.findById(id);
    if (!category) {
      throw new Error('Category not found');
    }
    return await category.getDescendants();
  }

  /**
   * Check if category name exists
   */
  async nameExists(name, excludeId = null) {
    return await this.model.nameExists(name, excludeId);
  }

  /**
   * Get category statistics
   */
  async getStats() {
    const sql = `
      SELECT 
        COUNT(*) as total_categories,
        COUNT(CASE WHEN is_active = true THEN 1 END) as active_categories,
        COUNT(CASE WHEN parent_id IS NULL THEN 1 END) as root_categories,
        AVG(product_count.count) as avg_products_per_category
      FROM categories c
      LEFT JOIN (
        SELECT category_id, COUNT(*) as count
        FROM products 
        WHERE is_active = true
        GROUP BY category_id
      ) product_count ON c.id = product_count.category_id
    `;

    const result = await query(sql);
    const stats = result.rows[0];

    return {
      totalCategories: parseInt(stats.total_categories),
      activeCategories: parseInt(stats.active_categories),
      rootCategories: parseInt(stats.root_categories),
      avgProductsPerCategory: parseFloat(stats.avg_products_per_category) || 0
    };
  }

  /**
   * Get popular categories based on product views
   */
  async getPopular(options = {}) {
    const { limit = 10, days = 30 } = options;

    const sql = `
      SELECT 
        c.*,
        COUNT(DISTINCT p.id) as product_count,
        COUNT(DISTINCT pa.id) as total_views
      FROM categories c
      LEFT JOIN products p ON c.id = p.category_id AND p.is_active = true
      LEFT JOIN product_analytics pa ON p.id = pa.product_id 
        AND pa.event_type = 'view' 
        AND pa.created_at >= NOW() - INTERVAL '${days} days'
      WHERE c.is_active = true
      GROUP BY c.id, c.name, c.description, c.image_url, c.parent_id, 
               c.is_active, c.sort_order, c.created_at, c.updated_at
      ORDER BY total_views DESC, product_count DESC
      LIMIT $1
    `;

    const result = await query(sql, [limit]);
    return result.rows.map(row => new this.model(row));
  }

  /**
   * Reorder categories
   */
  async reorder(categoryOrders) {
    if (!Array.isArray(categoryOrders)) {
      throw new Error('Category orders must be an array');
    }

    const client = await query.pool.connect();

    try {
      await client.query('BEGIN');

      for (const { id, sortOrder } of categoryOrders) {
        await client.query(
          'UPDATE categories SET sort_order = $1 WHERE id = $2',
          [sortOrder, id]
        );
      }

      await client.query('COMMIT');
      return true;

    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  /**
   * Search categories
   */
  async search(searchTerm, options = {}) {
    const { limit = 20, offset = 0, includeProducts = false } = options;

    let productJoin = '';
    let productSelect = '';
    let productGroupBy = '';

    if (includeProducts) {
      productJoin = 'LEFT JOIN products p ON c.id = p.category_id AND p.is_active = true';
      productSelect = ', COUNT(DISTINCT p.id) as product_count';
      productGroupBy = ', c.id';
    }

    const sql = `
      SELECT c.*${productSelect}
      FROM categories c
      ${productJoin}
      WHERE c.is_active = true 
        AND (
          c.name ILIKE $1 OR 
          c.description ILIKE $1
        )
      ${productGroupBy ? `GROUP BY ${productGroupBy.substring(2)}` : ''}
      ORDER BY c.sort_order ASC, c.name ASC
      LIMIT $2 OFFSET $3
    `;

    const result = await query(sql, [`%${searchTerm}%`, limit, offset]);
    return result.rows.map(row => new this.model(row));
  }
}

module.exports = CategoryRepository;