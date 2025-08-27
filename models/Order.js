const { query } = require('../db/connection');

class Order {
  constructor(data) {
    this.id = data.id;
    this.orderNumber = data.order_number;
    this.userId = data.user_id;
    this.status = data.status;
    this.paymentStatus = data.payment_status;
    this.subtotal = parseFloat(data.subtotal);
    this.taxAmount = parseFloat(data.tax_amount) || 0;
    this.shippingAmount = parseFloat(data.shipping_amount) || 0;
    this.discountAmount = parseFloat(data.discount_amount) || 0;
    this.totalAmount = parseFloat(data.total_amount);
    this.currency = data.currency || 'INR';
    this.paymentMethod = data.payment_method;
    this.notes = data.notes;
    this.shippedAt = data.shipped_at;
    this.deliveredAt = data.delivered_at;
    this.createdAt = data.created_at;
    this.updatedAt = data.updated_at;
    
    // Additional fields from joins
    this.userName = data.user_name;
    this.userEmail = data.user_email;
    this.itemCount = parseInt(data.item_count) || 0;
    this.items = data.items || [];
    this.shippingAddress = data.shipping_address;
    this.billingAddress = data.billing_address;
  }

  static async findAll(options = {}) {
    const {
      limit = 50,
      offset = 0,
      userId,
      status,
      paymentStatus,
      dateFrom,
      dateTo,
      sortBy = 'created_at',
      sortOrder = 'DESC'
    } = options;

    let whereConditions = [];
    let params = [];
    let paramIndex = 1;

    if (userId) {
      whereConditions.push(`o.user_id = $${paramIndex++}`);
      params.push(userId);
    }

    if (status) {
      whereConditions.push(`o.status = $${paramIndex++}`);
      params.push(status);
    }

    if (paymentStatus) {
      whereConditions.push(`o.payment_status = $${paramIndex++}`);
      params.push(paymentStatus);
    }

    if (dateFrom) {
      whereConditions.push(`o.created_at >= $${paramIndex++}`);
      params.push(dateFrom);
    }

    if (dateTo) {
      whereConditions.push(`o.created_at <= $${paramIndex++}`);
      params.push(dateTo);
    }

    const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : '';
    
    const validSortColumns = ['created_at', 'total_amount', 'status', 'order_number'];
    const sortColumn = validSortColumns.includes(sortBy) ? sortBy : 'created_at';
    const order = ['ASC', 'DESC'].includes(sortOrder.toUpperCase()) ? sortOrder.toUpperCase() : 'DESC';

    params.push(limit, offset);

    const sql = `
      SELECT 
        o.*,
        u.first_name || ' ' || u.last_name as user_name,
        u.email as user_email,
        COUNT(DISTINCT oi.id) as item_count
      FROM orders o
      LEFT JOIN users u ON o.user_id = u.id
      LEFT JOIN order_items oi ON o.id = oi.order_id
      ${whereClause}
      GROUP BY o.id, u.first_name, u.last_name, u.email
      ORDER BY o.${sortColumn} ${order}
      LIMIT $${paramIndex++} OFFSET $${paramIndex++}
    `;

    const result = await query(sql, params);
    return result.rows.map(row => new Order(row));
  }

  static async findById(id) {
    const sql = `
      SELECT 
        o.*,
        u.first_name || ' ' || u.last_name as user_name,
        u.email as user_email,
        COUNT(DISTINCT oi.id) as item_count,
        COALESCE(
          json_agg(
            DISTINCT jsonb_build_object(
              'id', oi.id,
              'product_id', oi.product_id,
              'product_name', oi.product_name,
              'product_sku', oi.product_sku,
              'quantity', oi.quantity,
              'unit_price', oi.unit_price,
              'line_total', oi.line_total
            )
          ) FILTER (WHERE oi.id IS NOT NULL), 
          '[]'::json
        ) as items,
        sa.street_address_1 || ', ' || sa.city || ', ' || sa.state || ' ' || sa.postal_code as shipping_address,
        ba.street_address_1 || ', ' || ba.city || ', ' || ba.state || ' ' || ba.postal_code as billing_address
      FROM orders o
      LEFT JOIN users u ON o.user_id = u.id
      LEFT JOIN order_items oi ON o.id = oi.order_id
      LEFT JOIN order_addresses sa ON o.id = sa.order_id AND sa.address_type = 'shipping'
      LEFT JOIN order_addresses ba ON o.id = ba.order_id AND ba.address_type = 'billing'
      WHERE o.id = $1
      GROUP BY o.id, u.first_name, u.last_name, u.email, sa.street_address_1, sa.city, sa.state, sa.postal_code, ba.street_address_1, ba.city, ba.state, ba.postal_code
    `;

    const result = await query(sql, [id]);
    return result.rows.length > 0 ? new Order(result.rows[0]) : null;
  }

  static async findByOrderNumber(orderNumber) {
    const sql = `
      SELECT o.*, u.first_name || ' ' || u.last_name as user_name, u.email as user_email
      FROM orders o
      LEFT JOIN users u ON o.user_id = u.id
      WHERE o.order_number = $1
    `;
    
    const result = await query(sql, [orderNumber]);
    return result.rows.length > 0 ? new Order(result.rows[0]) : null;
  }

  static async generateOrderNumber() {
    const prefix = 'SC';
    const timestamp = Date.now().toString().slice(-8);
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `${prefix}${timestamp}${random}`;
  }

  static async create(orderData) {
    const {
      userId, items, shippingAddress, billingAddress, paymentMethod, notes,
      subtotal, taxAmount = 0, shippingAmount = 0, discountAmount = 0
    } = orderData;

    if (!items || items.length === 0) {
      throw new Error('Order must contain at least one item');
    }

    const totalAmount = subtotal + taxAmount + shippingAmount - discountAmount;
    const orderNumber = await Order.generateOrderNumber();

    // Start transaction
    const client = await query.pool.connect();
    
    try {
      await client.query('BEGIN');

      // Create order
      const orderSql = `
        INSERT INTO orders (
          order_number, user_id, subtotal, tax_amount, shipping_amount, 
          discount_amount, total_amount, payment_method, notes
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        RETURNING *
      `;

      const orderParams = [
        orderNumber, userId, subtotal, taxAmount, shippingAmount,
        discountAmount, totalAmount, paymentMethod, notes
      ];

      const orderResult = await client.query(orderSql, orderParams);
      const order = orderResult.rows[0];

      // Create order items
      for (const item of items) {
        const itemSql = `
          INSERT INTO order_items (
            order_id, product_id, variant_id, product_name, product_sku,
            quantity, unit_price, line_total
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        `;

        const itemParams = [
          order.id, item.productId, item.variantId, item.productName,
          item.productSku, item.quantity, item.unitPrice, item.lineTotal
        ];

        await client.query(itemSql, itemParams);

        // Update product stock
        await client.query(
          'UPDATE products SET stock_quantity = GREATEST(0, stock_quantity - $1) WHERE id = $2',
          [item.quantity, item.productId]
        );
      }

      // Create shipping address
      if (shippingAddress) {
        const shippingAddressSql = `
          INSERT INTO order_addresses (
            order_id, address_type, first_name, last_name, email, phone,
            street_address_1, street_address_2, city, state, postal_code, country
          ) VALUES ($1, 'shipping', $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
        `;

        const shippingParams = [
          order.id, shippingAddress.firstName, shippingAddress.lastName,
          shippingAddress.email, shippingAddress.phone, shippingAddress.streetAddress1,
          shippingAddress.streetAddress2, shippingAddress.city, shippingAddress.state,
          shippingAddress.postalCode, shippingAddress.country
        ];

        await client.query(shippingAddressSql, shippingParams);
      }

      // Create billing address
      if (billingAddress) {
        const billingAddressSql = `
          INSERT INTO order_addresses (
            order_id, address_type, first_name, last_name, email, phone,
            street_address_1, street_address_2, city, state, postal_code, country
          ) VALUES ($1, 'billing', $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
        `;

        const billingParams = [
          order.id, billingAddress.firstName, billingAddress.lastName,
          billingAddress.email, billingAddress.phone, billingAddress.streetAddress1,
          billingAddress.streetAddress2, billingAddress.city, billingAddress.state,
          billingAddress.postalCode, billingAddress.country
        ];

        await client.query(billingAddressSql, billingParams);
      }

      await client.query('COMMIT');
      client.release();

      return new Order(order);

    } catch (error) {
      await client.query('ROLLBACK');
      client.release();
      throw error;
    }
  }

  static async getStats(options = {}) {
    const { dateFrom, dateTo, userId } = options;

    let whereConditions = [];
    let params = [];
    let paramIndex = 1;

    if (dateFrom) {
      whereConditions.push(`created_at >= $${paramIndex++}`);
      params.push(dateFrom);
    }

    if (dateTo) {
      whereConditions.push(`created_at <= $${paramIndex++}`);
      params.push(dateTo);
    }

    if (userId) {
      whereConditions.push(`user_id = $${paramIndex++}`);
      params.push(userId);
    }

    const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : '';

    const sql = `
      SELECT 
        COUNT(*) as total_orders,
        SUM(total_amount) as total_revenue,
        AVG(total_amount) as average_order_value,
        COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending_orders,
        COUNT(CASE WHEN status = 'confirmed' THEN 1 END) as confirmed_orders,
        COUNT(CASE WHEN status = 'processing' THEN 1 END) as processing_orders,
        COUNT(CASE WHEN status = 'shipped' THEN 1 END) as shipped_orders,
        COUNT(CASE WHEN status = 'delivered' THEN 1 END) as delivered_orders,
        COUNT(CASE WHEN status = 'cancelled' THEN 1 END) as cancelled_orders
      FROM orders 
      ${whereClause}
    `;

    const result = await query(sql, params);
    const stats = result.rows[0];

    return {
      totalOrders: parseInt(stats.total_orders),
      totalRevenue: parseFloat(stats.total_revenue) || 0,
      averageOrderValue: parseFloat(stats.average_order_value) || 0,
      statusBreakdown: {
        pending: parseInt(stats.pending_orders),
        confirmed: parseInt(stats.confirmed_orders),
        processing: parseInt(stats.processing_orders),
        shipped: parseInt(stats.shipped_orders),
        delivered: parseInt(stats.delivered_orders),
        cancelled: parseInt(stats.cancelled_orders)
      }
    };
  }

  async update(updateData) {
    const allowedFields = [
      'status', 'payment_status', 'payment_method', 'notes', 
      'shipped_at', 'delivered_at'
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
      UPDATE orders 
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

  async updateStatus(status) {
    const validStatuses = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];
    
    if (!validStatuses.includes(status)) {
      throw new Error('Invalid status');
    }

    const updateData = { status };

    // Set timestamps for status changes
    if (status === 'shipped' && !this.shippedAt) {
      updateData.shipped_at = new Date();
    }
    
    if (status === 'delivered' && !this.deliveredAt) {
      updateData.delivered_at = new Date();
    }

    return await this.update(updateData);
  }

  async updatePaymentStatus(paymentStatus) {
    const validStatuses = ['pending', 'paid', 'failed', 'refunded'];
    
    if (!validStatuses.includes(paymentStatus)) {
      throw new Error('Invalid payment status');
    }

    return await this.update({ payment_status: paymentStatus });
  }

  async getItems() {
    const sql = `
      SELECT 
        oi.*,
        p.name as current_product_name,
        p.price as current_product_price,
        pi.image_url as product_image
      FROM order_items oi
      LEFT JOIN products p ON oi.product_id = p.id
      LEFT JOIN product_images pi ON p.id = pi.product_id AND pi.is_primary = true
      WHERE oi.order_id = $1
      ORDER BY oi.created_at
    `;

    const result = await query(sql, [this.id]);
    return result.rows;
  }

  async getAddresses() {
    const sql = `
      SELECT * FROM order_addresses 
      WHERE order_id = $1 
      ORDER BY address_type
    `;

    const result = await query(sql, [this.id]);
    
    const addresses = {};
    result.rows.forEach(addr => {
      addresses[addr.address_type] = addr;
    });
    
    return addresses;
  }

  async cancel(reason = null) {
    if (this.status === 'delivered') {
      throw new Error('Cannot cancel delivered order');
    }

    if (this.status === 'cancelled') {
      throw new Error('Order is already cancelled');
    }

    // Restore stock for cancelled orders
    const items = await this.getItems();
    
    for (const item of items) {
      await query(
        'UPDATE products SET stock_quantity = stock_quantity + $1 WHERE id = $2',
        [item.quantity, item.product_id]
      );
    }

    const updateData = { 
      status: 'cancelled',
      notes: reason ? `${this.notes || ''}\nCancellation reason: ${reason}`.trim() : this.notes
    };

    return await this.update(updateData);
  }

  get canBeCancelled() {
    return !['delivered', 'cancelled'].includes(this.status);
  }

  get isPaid() {
    return this.paymentStatus === 'paid';
  }

  get isShipped() {
    return ['shipped', 'delivered'].includes(this.status);
  }

  get isDelivered() {
    return this.status === 'delivered';
  }

  get isCancelled() {
    return this.status === 'cancelled';
  }

  toJSON() {
    return {
      id: this.id,
      orderNumber: this.orderNumber,
      userId: this.userId,
      userName: this.userName,
      userEmail: this.userEmail,
      status: this.status,
      paymentStatus: this.paymentStatus,
      subtotal: this.subtotal,
      taxAmount: this.taxAmount,
      shippingAmount: this.shippingAmount,
      discountAmount: this.discountAmount,
      totalAmount: this.totalAmount,
      currency: this.currency,
      paymentMethod: this.paymentMethod,
      notes: this.notes,
      itemCount: this.itemCount,
      items: this.items,
      shippingAddress: this.shippingAddress,
      billingAddress: this.billingAddress,
      canBeCancelled: this.canBeCancelled,
      isPaid: this.isPaid,
      isShipped: this.isShipped,
      isDelivered: this.isDelivered,
      isCancelled: this.isCancelled,
      shippedAt: this.shippedAt,
      deliveredAt: this.deliveredAt,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }
}

module.exports = Order;