const Review = require('../models/Review');
const { query } = require('../db/connection');

class ReviewRepository {
  constructor() {
    this.model = Review;
  }

  /**
   * Get all reviews with filtering and pagination
   */
  async findAll(options = {}) {
    return await this.model.findAll(options);
  }

  /**
   * Get review by ID
   */
  async findById(id) {
    return await this.model.findById(id);
  }

  /**
   * Get reviews for a product
   */
  async getByProduct(productId, options = {}) {
    return await this.model.findByProduct(productId, options);
  }

  /**
   * Get reviews by a user
   */
  async getByUser(userId, options = {}) {
    return await this.model.findByUser(userId, options);
  }

  /**
   * Get product review statistics
   */
  async getProductStats(productId) {
    return await this.model.getProductStats(productId);
  }

  /**
   * Create new review
   */
  async create(reviewData) {
    return await this.model.create(reviewData);
  }

  /**
   * Update review
   */
  async update(id, updateData) {
    const review = await this.findById(id);
    if (!review) {
      throw new Error('Review not found');
    }
    return await review.update(updateData);
  }

  /**
   * Delete review
   */
  async delete(id) {
    const review = await this.findById(id);
    if (!review) {
      throw new Error('Review not found');
    }
    return await review.delete();
  }

  /**
   * Approve review
   */
  async approve(id) {
    const review = await this.findById(id);
    if (!review) {
      throw new Error('Review not found');
    }
    return await review.approve();
  }

  /**
   * Reject review
   */
  async reject(id) {
    const review = await this.findById(id);
    if (!review) {
      throw new Error('Review not found');
    }
    return await review.reject();
  }

  /**
   * Check if user can review a product
   */
  async checkUserCanReview(productId, userId) {
    return await this.model.checkUserCanReview(productId, userId);
  }

  /**
   * Mark review as helpful
   */
  async markHelpful(id) {
    const review = await this.findById(id);
    if (!review) {
      throw new Error('Review not found');
    }
    return await review.incrementHelpfulCount();
  }

  /**
   * Get pending reviews for moderation
   */
  async getPending(options = {}) {
    return await this.model.findAll({ 
      ...options, 
      isApproved: false 
    });
  }

  /**
   * Get featured reviews (high rating, helpful, verified purchase)
   */
  async getFeatured(options = {}) {
    const { limit = 10, productId } = options;

    let whereCondition = 'WHERE r.is_approved = true AND r.rating >= 4';
    let params = [];
    let paramIndex = 1;

    if (productId) {
      whereCondition += ` AND r.product_id = $${paramIndex++}`;
      params.push(productId);
    }

    params.push(limit);

    const sql = `
      SELECT 
        r.*,
        u.first_name as user_first_name,
        u.last_name as user_last_name,
        p.name as product_name
      FROM reviews r
      LEFT JOIN users u ON r.user_id = u.id
      LEFT JOIN products p ON r.product_id = p.id
      ${whereCondition}
      ORDER BY 
        r.is_verified_purchase DESC,
        r.helpful_count DESC,
        r.rating DESC,
        r.created_at DESC
      LIMIT $${paramIndex++}
    `;

    const result = await query(sql, params);
    return result.rows.map(row => new this.model(row));
  }

  /**
   * Get recent reviews
   */
  async getRecent(options = {}) {
    const { limit = 10, days = 7 } = options;

    const sql = `
      SELECT 
        r.*,
        u.first_name as user_first_name,
        u.last_name as user_last_name,
        p.name as product_name
      FROM reviews r
      LEFT JOIN users u ON r.user_id = u.id
      LEFT JOIN products p ON r.product_id = p.id
      WHERE r.is_approved = true 
        AND r.created_at >= NOW() - INTERVAL '${days} days'
      ORDER BY r.created_at DESC
      LIMIT $1
    `;

    const result = await query(sql, [limit]);
    return result.rows.map(row => new this.model(row));
  }

  /**
   * Get review trends and analytics
   */
  async getAnalytics(options = {}) {
    const { dateFrom, dateTo, productId } = options;

    let whereConditions = ['r.is_approved = true'];
    let params = [];
    let paramIndex = 1;

    if (dateFrom) {
      whereConditions.push(`r.created_at >= $${paramIndex++}`);
      params.push(dateFrom);
    }

    if (dateTo) {
      whereConditions.push(`r.created_at <= $${paramIndex++}`);
      params.push(dateTo);
    }

    if (productId) {
      whereConditions.push(`r.product_id = $${paramIndex++}`);
      params.push(productId);
    }

    const whereClause = `WHERE ${whereConditions.join(' AND ')}`;

    const sql = `
      SELECT 
        COUNT(*) as total_reviews,
        AVG(r.rating) as average_rating,
        COUNT(CASE WHEN r.rating = 5 THEN 1 END) as five_star_count,
        COUNT(CASE WHEN r.rating = 4 THEN 1 END) as four_star_count,
        COUNT(CASE WHEN r.rating = 3 THEN 1 END) as three_star_count,
        COUNT(CASE WHEN r.rating = 2 THEN 1 END) as two_star_count,
        COUNT(CASE WHEN r.rating = 1 THEN 1 END) as one_star_count,
        COUNT(CASE WHEN r.is_verified_purchase = true THEN 1 END) as verified_purchases,
        COUNT(CASE WHEN r.helpful_count > 0 THEN 1 END) as helpful_reviews,
        DATE_TRUNC('day', r.created_at) as review_date,
        COUNT(*) as daily_count
      FROM reviews r
      ${whereClause}
      GROUP BY DATE_TRUNC('day', r.created_at)
      ORDER BY review_date DESC
    `;

    const result = await query(sql, params);
    
    if (result.rows.length === 0) {
      return {
        totalReviews: 0,
        averageRating: 0,
        ratingDistribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
        verifiedPurchases: 0,
        helpfulReviews: 0,
        dailyTrends: []
      };
    }

    const aggregated = result.rows[0];
    
    return {
      totalReviews: parseInt(aggregated.total_reviews),
      averageRating: parseFloat(aggregated.average_rating) || 0,
      ratingDistribution: {
        5: parseInt(aggregated.five_star_count),
        4: parseInt(aggregated.four_star_count),
        3: parseInt(aggregated.three_star_count),
        2: parseInt(aggregated.two_star_count),
        1: parseInt(aggregated.one_star_count)
      },
      verifiedPurchases: parseInt(aggregated.verified_purchases),
      helpfulReviews: parseInt(aggregated.helpful_reviews),
      dailyTrends: result.rows.map(row => ({
        date: row.review_date,
        count: parseInt(row.daily_count)
      }))
    };
  }

  /**
   * Bulk approve reviews
   */
  async bulkApprove(reviewIds) {
    if (!Array.isArray(reviewIds) || reviewIds.length === 0) {
      throw new Error('Review IDs must be a non-empty array');
    }

    const sql = `
      UPDATE reviews 
      SET is_approved = true, updated_at = NOW()
      WHERE id = ANY($1::uuid[])
      RETURNING *
    `;

    const result = await query(sql, [reviewIds]);
    return result.rows.map(row => new this.model(row));
  }

  /**
   * Bulk reject reviews
   */
  async bulkReject(reviewIds) {
    if (!Array.isArray(reviewIds) || reviewIds.length === 0) {
      throw new Error('Review IDs must be a non-empty array');
    }

    const sql = `
      UPDATE reviews 
      SET is_approved = false, updated_at = NOW()
      WHERE id = ANY($1::uuid[])
      RETURNING *
    `;

    const result = await query(sql, [reviewIds]);
    return result.rows.map(row => new this.model(row));
  }

  /**
   * Get reviews that need attention (low rating, not helpful)
   */
  async getReviewsNeedingAttention(options = {}) {
    const { limit = 20 } = options;

    const sql = `
      SELECT 
        r.*,
        u.first_name as user_first_name,
        u.last_name as user_last_name,
        p.name as product_name
      FROM reviews r
      LEFT JOIN users u ON r.user_id = u.id
      LEFT JOIN products p ON r.product_id = p.id
      WHERE r.is_approved = true 
        AND (
          r.rating <= 2 
          OR (r.helpful_count = 0 AND r.created_at <= NOW() - INTERVAL '7 days')
        )
      ORDER BY r.rating ASC, r.created_at DESC
      LIMIT $1
    `;

    const result = await query(sql, [limit]);
    return result.rows.map(row => new this.model(row));
  }

  /**
   * Get user review history with product info
   */
  async getUserReviewHistory(userId, options = {}) {
    const { limit = 20, offset = 0 } = options;

    const sql = `
      SELECT 
        r.*,
        p.name as product_name,
        p.price as product_price,
        pi.image_url as product_image,
        c.name as category_name
      FROM reviews r
      JOIN products p ON r.product_id = p.id
      LEFT JOIN product_images pi ON p.id = pi.product_id AND pi.is_primary = true
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE r.user_id = $1
      ORDER BY r.created_at DESC
      LIMIT $2 OFFSET $3
    `;

    const result = await query(sql, [userId, limit, offset]);
    return result.rows.map(row => new this.model(row));
  }

  /**
   * Get review statistics
   */
  async getStats() {
    const sql = `
      SELECT 
        COUNT(*) as total_reviews,
        COUNT(CASE WHEN is_approved = true THEN 1 END) as approved_reviews,
        COUNT(CASE WHEN is_approved = false THEN 1 END) as pending_reviews,
        AVG(rating) as average_rating,
        COUNT(CASE WHEN is_verified_purchase = true THEN 1 END) as verified_purchases,
        COUNT(CASE WHEN helpful_count > 0 THEN 1 END) as helpful_reviews,
        COUNT(CASE WHEN created_at >= NOW() - INTERVAL '7 days' THEN 1 END) as recent_reviews,
        COUNT(CASE WHEN rating >= 4 THEN 1 END) as positive_reviews,
        COUNT(CASE WHEN rating <= 2 THEN 1 END) as negative_reviews
      FROM reviews
    `;

    const result = await query(sql);
    const stats = result.rows[0];

    return {
      totalReviews: parseInt(stats.total_reviews),
      approvedReviews: parseInt(stats.approved_reviews),
      pendingReviews: parseInt(stats.pending_reviews),
      averageRating: parseFloat(stats.average_rating) || 0,
      verifiedPurchases: parseInt(stats.verified_purchases),
      helpfulReviews: parseInt(stats.helpful_reviews),
      recentReviews: parseInt(stats.recent_reviews),
      positiveReviews: parseInt(stats.positive_reviews),
      negativeReviews: parseInt(stats.negative_reviews)
    };
  }
}

module.exports = ReviewRepository;