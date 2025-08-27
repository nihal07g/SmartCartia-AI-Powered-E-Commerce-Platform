const { query } = require('../db/connection');

class Product {
  constructor(data) {
    this.id = data.id;
    this.name = data.name;
    this.description = data.description;
    this.shortDescription = data.short_description;
    this.sku = data.sku;
    this.price = parseFloat(data.price);
    this.comparePrice = data.compare_price ? parseFloat(data.compare_price) : null;
    this.costPrice = data.cost_price ? parseFloat(data.cost_price) : null;
    this.categoryId = data.category_id;
    this.brandId = data.brand_id;
    this.weight = data.weight ? parseFloat(data.weight) : null;
    this.dimensions = data.dimensions;
    this.isActive = data.is_active;
    this.isFeatured = data.is_featured;
    this.isBestseller = data.is_bestseller;
    this.isNew = data.is_new;
    this.stockQuantity = parseInt(data.stock_quantity) || 0;
    this.lowStockThreshold = parseInt(data.low_stock_threshold) || 10;
    this.manageStock = data.manage_stock;
    this.allowBackorder = data.allow_backorder;
    this.taxClass = data.tax_class;
    this.metaTitle = data.meta_title;
    this.metaDescription = data.meta_description;
    this.searchKeywords = data.search_keywords;
    this.createdAt = data.created_at;
    this.updatedAt = data.updated_at;
    
    // Additional fields from joins
    this.categoryName = data.category_name;
    this.brandName = data.brand_name;
    this.avgRating = data.avg_rating ? parseFloat(data.avg_rating) : 0;
    this.reviewCount = parseInt(data.review_count) || 0;
    this.primaryImage = data.primary_image;
    this.images = data.images || [];
    this.variants = data.variants || [];
    this.specifications = data.specifications || [];
  }

  // Static methods for database operations
  static async findAll(options = {}) {
    const {
      limit = 50,
      offset = 0,
      category,
      brand,
      featured,
      bestseller,
      isNew,
      priceMin,
      priceMax,
      search,
      sortBy = 'created_at',
      sortOrder = 'DESC'
    } = options;

    let whereConditions = ['p.is_active = true'];
    let params = [];
    let paramIndex = 1;

    if (category) {
      whereConditions.push(`c.name = $${paramIndex++}`);
      params.push(category);
    }

    if (brand) {
      whereConditions.push(`b.name = $${paramIndex++}`);
      params.push(brand);
    }

    if (featured !== undefined) {
      whereConditions.push(`p.is_featured = $${paramIndex++}`);
      params.push(featured);
    }

    if (bestseller !== undefined) {
      whereConditions.push(`p.is_bestseller = $${paramIndex++}`);
      params.push(bestseller);
    }

    if (isNew !== undefined) {
      whereConditions.push(`p.is_new = $${paramIndex++}`);
      params.push(isNew);
    }

    if (priceMin !== undefined) {
      whereConditions.push(`p.price >= $${paramIndex++}`);
      params.push(priceMin);
    }

    if (priceMax !== undefined) {
      whereConditions.push(`p.price <= $${paramIndex++}`);
      params.push(priceMax);
    }

    if (search) {
      whereConditions.push(`(
        p.name ILIKE $${paramIndex} OR 
        p.description ILIKE $${paramIndex} OR 
        p.search_keywords ILIKE $${paramIndex} OR
        c.name ILIKE $${paramIndex} OR
        b.name ILIKE $${paramIndex}
      )`);
      params.push(`%${search}%`);
      paramIndex++;
    }

    const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : '';
    
    const validSortColumns = ['name', 'price', 'created_at', 'avg_rating', 'review_count'];
    const sortColumn = validSortColumns.includes(sortBy) ? sortBy : 'created_at';
    const order = ['ASC', 'DESC'].includes(sortOrder.toUpperCase()) ? sortOrder.toUpperCase() : 'DESC';

    params.push(limit, offset);

    const sql = `
      SELECT 
        p.*,
        c.name as category_name,
        b.name as brand_name,
        COALESCE(AVG(r.rating), 0) as avg_rating,
        COUNT(DISTINCT r.id) as review_count,
        pi.image_url as primary_image,
        COALESCE(
          json_agg(
            DISTINCT jsonb_build_object(
              'id', pi2.id,
              'url', pi2.image_url,
              'alt_text', pi2.alt_text,
              'sort_order', pi2.sort_order
            )
          ) FILTER (WHERE pi2.id IS NOT NULL), 
          '[]'::json
        ) as images
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      LEFT JOIN brands b ON p.brand_id = b.id
      LEFT JOIN reviews r ON p.id = r.product_id AND r.is_approved = true
      LEFT JOIN product_images pi ON p.id = pi.product_id AND pi.is_primary = true
      LEFT JOIN product_images pi2 ON p.id = pi2.product_id
      ${whereClause}
      GROUP BY p.id, c.name, b.name, pi.image_url
      ORDER BY ${sortColumn} ${order}
      LIMIT $${paramIndex++} OFFSET $${paramIndex++}
    `;

    const result = await query(sql, params);
    return result.rows.map(row => new Product(row));
  }

  static async findById(id) {
    const sql = `
      SELECT 
        p.*,
        c.name as category_name,
        b.name as brand_name,
        COALESCE(AVG(r.rating), 0) as avg_rating,
        COUNT(DISTINCT r.id) as review_count,
        pi.image_url as primary_image,
        COALESCE(
          json_agg(
            DISTINCT jsonb_build_object(
              'id', pi2.id,
              'url', pi2.image_url,
              'alt_text', pi2.alt_text,
              'sort_order', pi2.sort_order
            )
          ) FILTER (WHERE pi2.id IS NOT NULL), 
          '[]'::json
        ) as images,
        COALESCE(
          json_agg(
            DISTINCT jsonb_build_object(
              'id', pv.id,
              'name', pv.variant_name,
              'value', pv.variant_value,
              'price_adjustment', pv.price_adjustment,
              'stock_quantity', pv.stock_quantity
            )
          ) FILTER (WHERE pv.id IS NOT NULL), 
          '[]'::json
        ) as variants,
        COALESCE(
          json_agg(
            DISTINCT jsonb_build_object(
              'name', ps.spec_name,
              'value', ps.spec_value,
              'group', ps.spec_group
            ) ORDER BY ps.sort_order
          ) FILTER (WHERE ps.id IS NOT NULL), 
          '[]'::json
        ) as specifications
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      LEFT JOIN brands b ON p.brand_id = b.id
      LEFT JOIN reviews r ON p.id = r.product_id AND r.is_approved = true
      LEFT JOIN product_images pi ON p.id = pi.product_id AND pi.is_primary = true
      LEFT JOIN product_images pi2 ON p.id = pi2.product_id
      LEFT JOIN product_variants pv ON p.id = pv.product_id AND pv.is_active = true
      LEFT JOIN product_specifications ps ON p.id = ps.product_id
      WHERE p.id = $1 AND p.is_active = true
      GROUP BY p.id, c.name, b.name, pi.image_url
    `;

    const result = await query(sql, [id]);
    return result.rows.length > 0 ? new Product(result.rows[0]) : null;
  }

  static async findBySku(sku) {
    const sql = `
      SELECT p.*, c.name as category_name, b.name as brand_name
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      LEFT JOIN brands b ON p.brand_id = b.id
      WHERE p.sku = $1 AND p.is_active = true
    `;
    
    const result = await query(sql, [sku]);
    return result.rows.length > 0 ? new Product(result.rows[0]) : null;
  }

  static async findFeatured(limit = 10) {
    return await Product.findAll({ featured: true, limit });
  }

  static async findBestsellers(limit = 10) {
    return await Product.findAll({ bestseller: true, limit });
  }

  static async findNew(limit = 10) {
    return await Product.findAll({ isNew: true, limit });
  }

  static async findByCategory(categoryName, options = {}) {
    return await Product.findAll({ ...options, category: categoryName });
  }

  static async search(searchTerm, options = {}) {
    return await Product.findAll({ ...options, search: searchTerm });
  }

  static async getRelated(productId, limit = 4) {
    const sql = `
      SELECT DISTINCT p2.*, c.name as category_name, b.name as brand_name,
        COALESCE(AVG(r.rating), 0) as avg_rating,
        COUNT(DISTINCT r.id) as review_count,
        pi.image_url as primary_image
      FROM products p1
      JOIN products p2 ON p1.category_id = p2.category_id AND p1.id != p2.id
      LEFT JOIN categories c ON p2.category_id = c.id
      LEFT JOIN brands b ON p2.brand_id = b.id
      LEFT JOIN reviews r ON p2.id = r.product_id AND r.is_approved = true
      LEFT JOIN product_images pi ON p2.id = pi.product_id AND pi.is_primary = true
      WHERE p1.id = $1 AND p2.is_active = true
      GROUP BY p2.id, c.name, b.name, pi.image_url
      ORDER BY p2.is_featured DESC, p2.created_at DESC
      LIMIT $2
    `;

    const result = await query(sql, [productId, limit]);
    return result.rows.map(row => new Product(row));
  }

  static async create(productData) {
    const {
      name, description, shortDescription, sku, price, comparePrice, costPrice,
      categoryId, brandId, weight, dimensions, stockQuantity, lowStockThreshold,
      manageStock, allowBackorder, taxClass, metaTitle, metaDescription, searchKeywords
    } = productData;

    const sql = `
      INSERT INTO products (
        name, description, short_description, sku, price, compare_price, cost_price,
        category_id, brand_id, weight, dimensions, stock_quantity, low_stock_threshold,
        manage_stock, allow_backorder, tax_class, meta_title, meta_description, search_keywords
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19
      ) RETURNING *
    `;

    const params = [
      name, description, shortDescription, sku, price, comparePrice, costPrice,
      categoryId, brandId, weight, dimensions, stockQuantity, lowStockThreshold,
      manageStock, allowBackorder, taxClass, metaTitle, metaDescription, searchKeywords
    ];

    const result = await query(sql, params);
    return new Product(result.rows[0]);
  }

  async update(updateData) {
    const allowedFields = [
      'name', 'description', 'short_description', 'price', 'compare_price', 'cost_price',
      'category_id', 'brand_id', 'weight', 'dimensions', 'stock_quantity', 'low_stock_threshold',
      'manage_stock', 'allow_backorder', 'is_active', 'is_featured', 'is_bestseller', 'is_new',
      'tax_class', 'meta_title', 'meta_description', 'search_keywords'
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

    params.push(this.id);
    const sql = `
      UPDATE products 
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
    const sql = 'UPDATE products SET is_active = false WHERE id = $1';
    await query(sql, [this.id]);
    this.isActive = false;
    return this;
  }

  async updateStock(quantity, operation = 'set') {
    let sql;
    let newQuantity;

    switch (operation) {
      case 'add':
        sql = 'UPDATE products SET stock_quantity = stock_quantity + $1 WHERE id = $2 RETURNING stock_quantity';
        break;
      case 'subtract':
        sql = 'UPDATE products SET stock_quantity = GREATEST(0, stock_quantity - $1) WHERE id = $2 RETURNING stock_quantity';
        break;
      default:
        sql = 'UPDATE products SET stock_quantity = $1 WHERE id = $2 RETURNING stock_quantity';
    }

    const result = await query(sql, [quantity, this.id]);
    this.stockQuantity = result.rows[0].stock_quantity;
    return this.stockQuantity;
  }

  get isInStock() {
    return this.stockQuantity > 0 || this.allowBackorder;
  }

  get isLowStock() {
    return this.stockQuantity <= this.lowStockThreshold;
  }

  get discountPercentage() {
    if (!this.comparePrice || this.comparePrice <= this.price) return 0;
    return Math.round(((this.comparePrice - this.price) / this.comparePrice) * 100);
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      description: this.description,
      shortDescription: this.shortDescription,
      sku: this.sku,
      price: this.price,
      comparePrice: this.comparePrice,
      categoryId: this.categoryId,
      categoryName: this.categoryName,
      brandId: this.brandId,
      brandName: this.brandName,
      weight: this.weight,
      dimensions: this.dimensions,
      isActive: this.isActive,
      isFeatured: this.isFeatured,
      isBestseller: this.isBestseller,
      isNew: this.isNew,
      stockQuantity: this.stockQuantity,
      isInStock: this.isInStock,
      isLowStock: this.isLowStock,
      avgRating: this.avgRating,
      reviewCount: this.reviewCount,
      discountPercentage: this.discountPercentage,
      primaryImage: this.primaryImage,
      images: this.images,
      variants: this.variants,
      specifications: this.specifications,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }
}

module.exports = Product;