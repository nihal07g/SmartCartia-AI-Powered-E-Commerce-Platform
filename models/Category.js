const { query } = require('../db/connection');

class Category {
  constructor(data) {
    this.id = data.id;
    this.name = data.name;
    this.description = data.description;
    this.imageUrl = data.image_url;
    this.parentId = data.parent_id;
    this.isActive = data.is_active;
    this.sortOrder = parseInt(data.sort_order) || 0;
    this.createdAt = data.created_at;
    this.updatedAt = data.updated_at;
    
    // Additional fields from joins
    this.parentName = data.parent_name;
    this.productCount = parseInt(data.product_count) || 0;
    this.children = data.children || [];
  }

  static async findAll(options = {}) {
    const {
      limit = 50,
      offset = 0,
      parentId = null,
      isActive = true,
      includeProductCount = false,
      sortBy = 'sort_order',
      sortOrder = 'ASC'
    } = options;

    let whereConditions = [];
    let params = [];
    let paramIndex = 1;

    if (parentId !== undefined) {
      if (parentId === null) {
        whereConditions.push('c.parent_id IS NULL');
      } else {
        whereConditions.push(`c.parent_id = $${paramIndex++}`);
        params.push(parentId);
      }
    }

    if (isActive !== undefined) {
      whereConditions.push(`c.is_active = $${paramIndex++}`);
      params.push(isActive);
    }

    const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : '';
    
    const validSortColumns = ['name', 'sort_order', 'created_at'];
    const sortColumn = validSortColumns.includes(sortBy) ? sortBy : 'sort_order';
    const order = ['ASC', 'DESC'].includes(sortOrder.toUpperCase()) ? sortOrder.toUpperCase() : 'ASC';

    params.push(limit, offset);

    let productCountSelect = '';
    let productCountJoin = '';
    
    if (includeProductCount) {
      productCountSelect = ', COUNT(DISTINCT p.id) as product_count';
      productCountJoin = 'LEFT JOIN products p ON c.id = p.category_id AND p.is_active = true';
    }

    const sql = `
      SELECT 
        c.*,
        pc.name as parent_name
        ${productCountSelect}
      FROM categories c
      LEFT JOIN categories pc ON c.parent_id = pc.id
      ${productCountJoin}
      ${whereClause}
      GROUP BY c.id, pc.name
      ORDER BY c.${sortColumn} ${order}
      LIMIT $${paramIndex++} OFFSET $${paramIndex++}
    `;

    const result = await query(sql, params);
    return result.rows.map(row => new Category(row));
  }

  static async findById(id) {
    const sql = `
      SELECT 
        c.*,
        pc.name as parent_name,
        COUNT(DISTINCT p.id) as product_count,
        COALESCE(
          json_agg(
            DISTINCT jsonb_build_object(
              'id', cc.id,
              'name', cc.name,
              'description', cc.description,
              'image_url', cc.image_url,
              'is_active', cc.is_active,
              'sort_order', cc.sort_order
            )
          ) FILTER (WHERE cc.id IS NOT NULL), 
          '[]'::json
        ) as children
      FROM categories c
      LEFT JOIN categories pc ON c.parent_id = pc.id
      LEFT JOIN products p ON c.id = p.category_id AND p.is_active = true
      LEFT JOIN categories cc ON c.id = cc.parent_id AND cc.is_active = true
      WHERE c.id = $1
      GROUP BY c.id, pc.name
    `;

    const result = await query(sql, [id]);
    return result.rows.length > 0 ? new Category(result.rows[0]) : null;
  }

  static async findByName(name) {
    const sql = `
      SELECT c.*, pc.name as parent_name
      FROM categories c
      LEFT JOIN categories pc ON c.parent_id = pc.id
      WHERE c.name = $1 AND c.is_active = true
    `;
    
    const result = await query(sql, [name]);
    return result.rows.length > 0 ? new Category(result.rows[0]) : null;
  }

  static async findRootCategories() {
    return await Category.findAll({ parentId: null });
  }

  static async findWithHierarchy() {
    const sql = `
      WITH RECURSIVE category_tree AS (
        -- Root categories
        SELECT 
          c.*,
          c.name as path,
          0 as level,
          ARRAY[c.sort_order] as sort_path
        FROM categories c 
        WHERE c.parent_id IS NULL AND c.is_active = true
        
        UNION ALL
        
        -- Child categories
        SELECT 
          c.*,
          ct.path || ' > ' || c.name as path,
          ct.level + 1,
          ct.sort_path || c.sort_order
        FROM categories c
        JOIN category_tree ct ON c.parent_id = ct.id
        WHERE c.is_active = true
      )
      SELECT 
        ct.*,
        COUNT(DISTINCT p.id) as product_count
      FROM category_tree ct
      LEFT JOIN products p ON ct.id = p.category_id AND p.is_active = true
      GROUP BY ct.id, ct.name, ct.description, ct.image_url, ct.parent_id, 
               ct.is_active, ct.sort_order, ct.created_at, ct.updated_at, 
               ct.path, ct.level, ct.sort_path
      ORDER BY ct.sort_path
    `;

    const result = await query(sql);
    return result.rows.map(row => ({
      ...new Category(row),
      path: row.path,
      level: row.level
    }));
  }

  static async create(categoryData) {
    const {
      name, description, imageUrl, parentId, sortOrder = 0
    } = categoryData;

    // Check if name already exists
    const existingCategory = await Category.findByName(name);
    if (existingCategory) {
      throw new Error('Category name already exists');
    }

    // Validate parent exists if provided
    if (parentId) {
      const parent = await Category.findById(parentId);
      if (!parent) {
        throw new Error('Parent category not found');
      }
    }

    const sql = `
      INSERT INTO categories (
        name, description, image_url, parent_id, sort_order
      ) VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `;

    const params = [name, description, imageUrl, parentId, sortOrder];

    const result = await query(sql, params);
    return new Category(result.rows[0]);
  }

  static async nameExists(name, excludeId = null) {
    let sql = 'SELECT COUNT(*) as count FROM categories WHERE name = $1';
    let params = [name];

    if (excludeId) {
      sql += ' AND id != $2';
      params.push(excludeId);
    }

    const result = await query(sql, params);
    return parseInt(result.rows[0].count) > 0;
  }

  async update(updateData) {
    const allowedFields = [
      'name', 'description', 'image_url', 'parent_id', 'is_active', 'sort_order'
    ];

    const updates = [];
    const params = [];
    let paramIndex = 1;

    for (const [key, value] of Object.entries(updateData)) {
      if (allowedFields.includes(key)) {
        updates.push(`${key} = $${paramIndex++}`);
        params.push(value);
      }
    }

    if (updates.length === 0) {
      throw new Error('No valid fields to update');
    }

    // Validate name uniqueness if being updated
    if (updateData.name && await Category.nameExists(updateData.name, this.id)) {
      throw new Error('Category name already exists');
    }

    // Validate parent if being updated
    if (updateData.parent_id) {
      if (updateData.parent_id === this.id) {
        throw new Error('Category cannot be its own parent');
      }
      
      const parent = await Category.findById(updateData.parent_id);
      if (!parent) {
        throw new Error('Parent category not found');
      }
    }

    params.push(this.id);
    const sql = `
      UPDATE categories 
      SET ${updates.join(', ')}, updated_at = NOW()
      WHERE id = $${paramIndex}
      RETURNING *
    `;

    const result = await query(sql, params);
    if (result.rows.length > 0) {
      Object.assign(this, result.rows[0]);
    }
    return this;
  }

  async delete() {
    // Check if category has products
    const productCheck = await query(
      'SELECT COUNT(*) as count FROM products WHERE category_id = $1',
      [this.id]
    );

    if (parseInt(productCheck.rows[0].count) > 0) {
      throw new Error('Cannot delete category with associated products');
    }

    // Check if category has children
    const childrenCheck = await query(
      'SELECT COUNT(*) as count FROM categories WHERE parent_id = $1',
      [this.id]
    );

    if (parseInt(childrenCheck.rows[0].count) > 0) {
      throw new Error('Cannot delete category with child categories');
    }

    const sql = 'DELETE FROM categories WHERE id = $1';
    await query(sql, [this.id]);
    return true;
  }

  async deactivate() {
    const sql = 'UPDATE categories SET is_active = false WHERE id = $1';
    await query(sql, [this.id]);
    this.isActive = false;
    return this;
  }

  async activate() {
    const sql = 'UPDATE categories SET is_active = true WHERE id = $1';
    await query(sql, [this.id]);
    this.isActive = true;
    return this;
  }

  async getProducts(options = {}) {
    const Product = require('./Product');
    return await Product.findByCategory(this.name, options);
  }

  async getChildren() {
    return await Category.findAll({ parentId: this.id });
  }

  async getParent() {
    if (!this.parentId) return null;
    return await Category.findById(this.parentId);
  }

  async getAncestors() {
    if (!this.parentId) return [];
    
    const sql = `
      WITH RECURSIVE ancestors AS (
        SELECT c.*, 0 as level
        FROM categories c 
        WHERE c.id = $1
        
        UNION ALL
        
        SELECT c.*, a.level + 1
        FROM categories c
        JOIN ancestors a ON c.id = a.parent_id
      )
      SELECT * FROM ancestors 
      WHERE level > 0
      ORDER BY level DESC
    `;

    const result = await query(sql, [this.parentId]);
    return result.rows.map(row => new Category(row));
  }

  async getDescendants() {
    const sql = `
      WITH RECURSIVE descendants AS (
        SELECT c.*, 0 as level
        FROM categories c 
        WHERE c.parent_id = $1
        
        UNION ALL
        
        SELECT c.*, d.level + 1
        FROM categories c
        JOIN descendants d ON c.parent_id = d.id
      )
      SELECT * FROM descendants 
      ORDER BY level, sort_order
    `;

    const result = await query(sql, [this.id]);
    return result.rows.map(row => new Category(row));
  }

  get isRootCategory() {
    return this.parentId === null;
  }

  get hasChildren() {
    return this.children && this.children.length > 0;
  }

  get breadcrumb() {
    // This would need to be populated by getAncestors() or similar
    return [];
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      description: this.description,
      imageUrl: this.imageUrl,
      parentId: this.parentId,
      parentName: this.parentName,
      isActive: this.isActive,
      sortOrder: this.sortOrder,
      productCount: this.productCount,
      children: this.children,
      isRootCategory: this.isRootCategory,
      hasChildren: this.hasChildren,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }
}

module.exports = Category;