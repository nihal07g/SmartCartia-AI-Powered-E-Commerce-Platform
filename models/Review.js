const { query } = require('../db/connection');

class Review {
  constructor(data) {
    this.id = data.id;
    this.productId = data.product_id;
    this.userId = data.user_id;
    this.rating = parseInt(data.rating);
    this.title = data.title;
    this.content = data.content;
    this.isVerifiedPurchase = data.is_verified_purchase;
    this.isApproved = data.is_approved;
    this.helpfulCount = parseInt(data.helpful_count) || 0;
    this.createdAt = data.created_at;
    this.updatedAt = data.updated_at;
    
    // Additional fields from joins
    this.userName = data.user_name;
    this.userFirstName = data.user_first_name;
    this.userLastName = data.user_last_name;
    this.productName = data.product_name;
  }

  static async findAll(options = {}) {
    const {
      limit = 50,
      offset = 0,
      productId,
      userId,
      rating,
      isApproved = true,
      sortBy = 'created_at',
      sortOrder = 'DESC'
    } = options;

    let whereConditions = [];
    let params = [];
    let paramIndex = 1;

    if (productId) {
      whereConditions.push(`r.product_id = $${paramIndex++}`);
      params.push(productId);
    }

    if (userId) {
      whereConditions.push(`r.user_id = $${paramIndex++}`);
      params.push(userId);
    }

    if (rating) {
      whereConditions.push(`r.rating = $${paramIndex++}`);
      params.push(rating);
    }

    if (isApproved !== undefined) {
      whereConditions.push(`r.is_approved = $${paramIndex++}`);
      params.push(isApproved);
    }

    const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : '';
    
    const validSortColumns = ['created_at', 'rating', 'helpful_count'];
    const sortColumn = validSortColumns.includes(sortBy) ? sortBy : 'created_at';
    const order = ['ASC', 'DESC'].includes(sortOrder.toUpperCase()) ? sortOrder.toUpperCase() : 'DESC';

    params.push(limit, offset);

    const sql = `
      SELECT 
        r.*,
        u.first_name as user_first_name,
        u.last_name as user_last_name,
        p.name as product_name
      FROM reviews r
      LEFT JOIN users u ON r.user_id = u.id
      LEFT JOIN products p ON r.product_id = p.id
      ${whereClause}
      ORDER BY r.${sortColumn} ${order}
      LIMIT $${paramIndex++} OFFSET $${paramIndex++}
    `;

    const result = await query(sql, params);
    return result.rows.map(row => new Review(row));
  }

  static async findById(id) {
    const sql = `
      SELECT 
        r.*,
        u.first_name as user_first_name,
        u.last_name as user_last_name,
        p.name as product_name
      FROM reviews r
      LEFT JOIN users u ON r.user_id = u.id
      LEFT JOIN products p ON r.product_id = p.id
      WHERE r.id = $1
    `;

    const result = await query(sql, [id]);
    return result.rows.length > 0 ? new Review(result.rows[0]) : null;
  }

  static async findByProduct(productId, options = {}) {
    return await Review.findAll({ ...options, productId });
  }

  static async findByUser(userId, options = {}) {
    return await Review.findAll({ ...options, userId });
  }

  static async getProductStats(productId) {
    const sql = `
      SELECT 
        COUNT(*) as total_reviews,
        AVG(rating) as average_rating,
        COUNT(CASE WHEN rating = 5 THEN 1 END) as five_star,
        COUNT(CASE WHEN rating = 4 THEN 1 END) as four_star,
        COUNT(CASE WHEN rating = 3 THEN 1 END) as three_star,
        COUNT(CASE WHEN rating = 2 THEN 1 END) as two_star,
        COUNT(CASE WHEN rating = 1 THEN 1 END) as one_star,
        COUNT(CASE WHEN is_verified_purchase = true THEN 1 END) as verified_purchases
      FROM reviews 
      WHERE product_id = $1 AND is_approved = true
    `;

    const result = await query(sql, [productId]);
    const stats = result.rows[0];

    return {
      totalReviews: parseInt(stats.total_reviews),
      averageRating: parseFloat(stats.average_rating) || 0,
      ratingDistribution: {
        5: parseInt(stats.five_star),
        4: parseInt(stats.four_star),
        3: parseInt(stats.three_star),
        2: parseInt(stats.two_star),
        1: parseInt(stats.one_star)
      },
      verifiedPurchases: parseInt(stats.verified_purchases)
    };
  }

  static async create(reviewData) {
    const {
      productId, userId, rating, title, content, isVerifiedPurchase = false
    } = reviewData;

    // Validate rating
    if (rating < 1 || rating > 5) {
      throw new Error('Rating must be between 1 and 5');
    }

    // Check if user has already reviewed this product
    const existingReview = await query(
      'SELECT id FROM reviews WHERE product_id = $1 AND user_id = $2',
      [productId, userId]
    );

    if (existingReview.rows.length > 0) {
      throw new Error('User has already reviewed this product');
    }

    const sql = `
      INSERT INTO reviews (
        product_id, user_id, rating, title, content, is_verified_purchase
      ) VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `;

    const params = [productId, userId, rating, title, content, isVerifiedPurchase];

    const result = await query(sql, params);
    return new Review(result.rows[0]);
  }

  static async checkUserCanReview(productId, userId) {
    // Check if user has purchased the product
    const purchaseCheck = await query(`
      SELECT COUNT(*) as count
      FROM order_items oi
      JOIN orders o ON oi.order_id = o.id
      WHERE oi.product_id = $1 AND o.user_id = $2 AND o.status = 'delivered'
    `, [productId, userId]);

    const hasPurchased = parseInt(purchaseCheck.rows[0].count) > 0;

    // Check if user has already reviewed
    const reviewCheck = await query(
      'SELECT COUNT(*) as count FROM reviews WHERE product_id = $1 AND user_id = $2',
      [productId, userId]
    );

    const hasReviewed = parseInt(reviewCheck.rows[0].count) > 0;

    return {
      canReview: !hasReviewed,
      hasPurchased,
      hasReviewed
    };
  }

  async update(updateData) {
    const allowedFields = ['rating', 'title', 'content', 'is_approved'];

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

    // Validate rating if being updated
    if (updateData.rating && (updateData.rating < 1 || updateData.rating > 5)) {
      throw new Error('Rating must be between 1 and 5');
    }

    params.push(this.id);
    const sql = `
      UPDATE reviews 
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

  async approve() {
    return await this.update({ is_approved: true });
  }

  async reject() {
    return await this.update({ is_approved: false });
  }

  async delete() {
    const sql = 'DELETE FROM reviews WHERE id = $1';
    await query(sql, [this.id]);
    return true;
  }

  async incrementHelpfulCount() {
    const sql = `
      UPDATE reviews 
      SET helpful_count = helpful_count + 1 
      WHERE id = $1 
      RETURNING helpful_count
    `;

    const result = await query(sql, [this.id]);
    this.helpfulCount = result.rows[0].helpful_count;
    return this.helpfulCount;
  }

  get userDisplayName() {
    if (this.userFirstName && this.userLastName) {
      return `${this.userFirstName} ${this.userLastName.charAt(0)}.`;
    }
    return 'Anonymous User';
  }

  get ratingStars() {
    return '★'.repeat(this.rating) + '☆'.repeat(5 - this.rating);
  }

  get isPositive() {
    return this.rating >= 4;
  }

  get isNegative() {
    return this.rating <= 2;
  }

  toJSON() {
    return {
      id: this.id,
      productId: this.productId,
      productName: this.productName,
      userId: this.userId,
      userDisplayName: this.userDisplayName,
      rating: this.rating,
      ratingStars: this.ratingStars,
      title: this.title,
      content: this.content,
      isVerifiedPurchase: this.isVerifiedPurchase,
      isApproved: this.isApproved,
      isPositive: this.isPositive,
      isNegative: this.isNegative,
      helpfulCount: this.helpfulCount,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }
}

module.exports = Review;