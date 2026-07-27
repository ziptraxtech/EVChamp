const net = require('node:net');
const path = require('node:path');
const { neon } = require('@neondatabase/serverless');
// Load env from the project root (.env.local / .env) as well as server/.env, so
// a single DATABASE_URL in the root .env.local is picked up regardless of cwd.
require('dotenv').config({
  path: [
    path.resolve(__dirname, '../.env.local'),
    path.resolve(__dirname, '../.env'),
    path.resolve(__dirname, '.env'),
  ],
});

// Neon's HTTP driver uses global fetch (undici). On a slow/marginal network,
// undici's Happy-Eyeballs default 250ms per-address attempt timeout can bounce
// between the host's IPv4/IPv6 addresses and abort with UND_ERR_CONNECT_TIMEOUT
// (surfacing as an intermittent 504) before any connection completes. Give each
// address more time to connect.
net.setDefaultAutoSelectFamilyAttemptTimeout(5000);

// Null when DATABASE_URL is absent so the server can still boot in local dev
// (endpoints that need the DB guard on this / on process.env.DATABASE_URL).
const sql = process.env.DATABASE_URL ? neon(process.env.DATABASE_URL) : null;

async function initDB() {
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS cell_audits (
        id SERIAL PRIMARY KEY,
        audit_id TEXT UNIQUE NOT NULL,
        qr_raw TEXT,
        serial_number TEXT NOT NULL,
        manufacturer TEXT,
        manufacturer_code TEXT,
        model TEXT,
        model_code TEXT,
        chemistry TEXT,
        chemistry_code TEXT,
        production_type TEXT,
        production_line TEXT,
        task_code TEXT,
        factory_address TEXT,
        factory_identifier TEXT,
        production_date TEXT,
        capacity TEXT,
        voltage TEXT,
        country_of_origin TEXT,
        qr_authenticity_score INTEGER,
        qr_validation_status TEXT,
        auth_check_score INTEGER,
        auth_check_status TEXT,
        auth_check_details JSONB,
        certificate_number TEXT,
        certificate_generated BOOLEAN DEFAULT FALSE,
        cell_data JSONB,
        audited_by TEXT,
        audited_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `;

    await sql`
      CREATE INDEX IF NOT EXISTS idx_cell_audits_serial ON cell_audits(serial_number)
    `;
    await sql`
      CREATE INDEX IF NOT EXISTS idx_cell_audits_qr ON cell_audits(qr_raw)
    `;
    await sql`
      CREATE INDEX IF NOT EXISTS idx_cell_audits_audit_id ON cell_audits(audit_id)
    `;

    console.log('✅ Neon DB: cell_audits table ready');

    // Users table for Clerk sign-in sync
    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        clerk_id TEXT UNIQUE NOT NULL,
        email TEXT,
        first_name TEXT,
        last_name TEXT,
        image_url TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        last_sign_in_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `;
    await sql`
      CREATE INDEX IF NOT EXISTS idx_users_clerk_id ON users(clerk_id)
    `;
    console.log('✅ Neon DB: users table ready');

    // EV Marketplace — test-drive bookings
    await sql`
      CREATE TABLE IF NOT EXISTS test_drive_bookings (
        id SERIAL PRIMARY KEY,
        reference TEXT UNIQUE NOT NULL,
        car_id TEXT NOT NULL,
        first_name TEXT NOT NULL,
        last_name TEXT NOT NULL,
        email TEXT NOT NULL,
        country_code TEXT,
        phone TEXT,
        city TEXT,
        preferred_date TEXT,
        address TEXT,
        time_slot TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `;
    console.log('✅ Neon DB: test_drive_bookings table ready');

    // EV Marketplace — monthly offer leads
    await sql`
      CREATE TABLE IF NOT EXISTS offer_leads (
        id SERIAL PRIMARY KEY,
        car_id TEXT NOT NULL,
        full_name TEXT NOT NULL,
        email TEXT NOT NULL,
        country_code TEXT,
        phone TEXT,
        offer_total INTEGER,
        source TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `;
    console.log('✅ Neon DB: offer_leads table ready');

    // Autopay Subscriptions — automatic plan renewals
    await sql`
      CREATE TABLE IF NOT EXISTS autopay_subscriptions (
        id SERIAL PRIMARY KEY,
        subscription_id TEXT UNIQUE NOT NULL,
        clerk_user_id TEXT NOT NULL,
        plan_id TEXT NOT NULL,
        plan_name TEXT NOT NULL,
        plan_details JSONB,
        razorpay_subscription_id TEXT,
        status TEXT DEFAULT 'active',
        start_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        next_renewal_date TIMESTAMP WITH TIME ZONE NOT NULL,
        last_charge_date TIMESTAMP WITH TIME ZONE,
        failed_attempts INTEGER DEFAULT 0,
        max_retries INTEGER DEFAULT 3,
        payment_method JSONB,
        auto_charge_enabled BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `;
    await sql`
      CREATE INDEX IF NOT EXISTS idx_autopay_clerk_user_id ON autopay_subscriptions(clerk_user_id)
    `;
    await sql`
      CREATE INDEX IF NOT EXISTS idx_autopay_subscription_id ON autopay_subscriptions(subscription_id)
    `;
    await sql`
      CREATE INDEX IF NOT EXISTS idx_autopay_status ON autopay_subscriptions(status)
    `;
    console.log('✅ Neon DB: autopay_subscriptions table ready');

    // Coupon Usage Tracking — track first purchase discount usage
    await sql`
      CREATE TABLE IF NOT EXISTS coupon_usage (
        id SERIAL PRIMARY KEY,
        clerk_user_id TEXT NOT NULL,
        plan_id TEXT NOT NULL,
        coupon_code TEXT NOT NULL,
        discount_amount DECIMAL(10, 2),
        original_price DECIMAL(10, 2),
        final_price DECIMAL(10, 2),
        subscription_id TEXT,
        payment_id TEXT,
        used_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        UNIQUE(clerk_user_id, plan_id)
      )
    `;
    await sql`
      CREATE INDEX IF NOT EXISTS idx_coupon_usage_user ON coupon_usage(clerk_user_id)
    `;
    await sql`
      CREATE INDEX IF NOT EXISTS idx_coupon_usage_plan ON coupon_usage(plan_id, clerk_user_id)
    `;
    console.log('✅ Neon DB: coupon_usage table ready');

    return true;
  } catch (err) {
    console.error('❌ Neon DB init failed:', err.message);
    return false;
  }
}

async function upsertUser({ clerkId, email, firstName, lastName, imageUrl }) {
  const result = await sql`
    INSERT INTO users (clerk_id, email, first_name, last_name, image_url, last_sign_in_at)
    VALUES (${clerkId}, ${email}, ${firstName}, ${lastName}, ${imageUrl}, NOW())
    ON CONFLICT (clerk_id) DO UPDATE SET
      email = EXCLUDED.email,
      first_name = EXCLUDED.first_name,
      last_name = EXCLUDED.last_name,
      image_url = EXCLUDED.image_url,
      last_sign_in_at = NOW()
    RETURNING *
  `;
  return result[0];
}

async function saveAudit(auditData) {
  const {
    auditId, qrRaw, serialNumber, manufacturer, manufacturerCode,
    model, modelCode, chemistry, chemistryCode, productionType,
    productionLine, taskCode, factoryAddress, factoryIdentifier,
    productionDate, capacity, voltage, countryOfOrigin,
    qrAuthenticityScore, qrValidationStatus,
    authCheckScore, authCheckStatus, authCheckDetails,
    certificateNumber, certificateGenerated,
    cellData, auditedBy
  } = auditData;

  const result = await sql`
    INSERT INTO cell_audits (
      audit_id, qr_raw, serial_number, manufacturer, manufacturer_code,
      model, model_code, chemistry, chemistry_code, production_type,
      production_line, task_code, factory_address, factory_identifier,
      production_date, capacity, voltage, country_of_origin,
      qr_authenticity_score, qr_validation_status,
      auth_check_score, auth_check_status, auth_check_details,
      certificate_number, certificate_generated,
      cell_data, audited_by
    ) VALUES (
      ${auditId}, ${qrRaw || null}, ${serialNumber}, ${manufacturer || null}, ${manufacturerCode || null},
      ${model || null}, ${modelCode || null}, ${chemistry || null}, ${chemistryCode || null}, ${productionType || null},
      ${productionLine || null}, ${taskCode || null}, ${factoryAddress || null}, ${factoryIdentifier || null},
      ${productionDate || null}, ${capacity || null}, ${voltage || null}, ${countryOfOrigin || null},
      ${qrAuthenticityScore || null}, ${qrValidationStatus || null},
      ${authCheckScore || null}, ${authCheckStatus || null}, ${JSON.stringify(authCheckDetails || null)},
      ${certificateNumber || null}, ${certificateGenerated || false},
      ${JSON.stringify(cellData || null)}, ${auditedBy || null}
    )
    RETURNING *
  `;
  return result[0];
}

async function getAuditBySerial(serialNumber) {
  const results = await sql`
    SELECT * FROM cell_audits WHERE serial_number = ${serialNumber}
    ORDER BY created_at DESC
  `;
  return results;
}

async function getAuditById(auditId) {
  const results = await sql`
    SELECT * FROM cell_audits WHERE audit_id = ${auditId}
  `;
  return results[0] || null;
}

async function getAllAudits(limit = 50, offset = 0) {
  const results = await sql`
    SELECT * FROM cell_audits
    ORDER BY created_at DESC
    LIMIT ${limit} OFFSET ${offset}
  `;
  return results;
}

async function updateCertificate(auditId, certificateNumber) {
  const result = await sql`
    UPDATE cell_audits
    SET certificate_number = ${certificateNumber}, certificate_generated = true
    WHERE audit_id = ${auditId}
    RETURNING *
  `;
  return result[0] || null;
}

// ── EV Marketplace ──────────────────────────────────────────────────────────
async function saveBooking(b) {
  const result = await sql`
    INSERT INTO test_drive_bookings
      (reference, car_id, first_name, last_name, email, country_code, phone, city, preferred_date, address, time_slot)
    VALUES
      (${b.reference}, ${b.carId}, ${b.firstName}, ${b.lastName}, ${b.email}, ${b.countryCode || '+91'}, ${b.phone || null},
       ${b.city || null}, ${b.preferredDate || null}, ${b.address || null}, ${b.timeSlot || null})
    RETURNING *
  `;
  return result[0];
}

async function saveOfferLead(l) {
  const result = await sql`
    INSERT INTO offer_leads (car_id, full_name, email, country_code, phone, offer_total, source)
    VALUES (${l.carId}, ${l.fullName}, ${l.email}, ${l.countryCode || '+91'}, ${l.phone || null}, ${l.offerTotal ?? null}, ${l.source ?? null})
    RETURNING id
  `;
  return result[0];
}

// ── Autopay Subscriptions ──────────────────────────────────────────────────
async function createAutopaySubscription(subscriptionData) {
  const {
    subscriptionId, clerkUserId, planId, planName, planDetails,
    razorpaySubscriptionId, nextRenewalDate, paymentMethod
  } = subscriptionData;

  const result = await sql`
    INSERT INTO autopay_subscriptions (
      subscription_id, clerk_user_id, plan_id, plan_name, plan_details,
      razorpay_subscription_id, next_renewal_date, payment_method, status
    ) VALUES (
      ${subscriptionId}, ${clerkUserId}, ${planId}, ${planName}, ${JSON.stringify(planDetails)},
      ${razorpaySubscriptionId || null}, ${nextRenewalDate}, ${JSON.stringify(paymentMethod || {})}, 'active'
    )
    RETURNING *
  `;
  return result[0];
}

async function getAutopaySubscriptionsByUser(clerkUserId) {
  const results = await sql`
    SELECT * FROM autopay_subscriptions 
    WHERE clerk_user_id = ${clerkUserId}
    ORDER BY created_at DESC
  `;
  return results;
}

async function getAutopaySubscriptionById(subscriptionId) {
  const results = await sql`
    SELECT * FROM autopay_subscriptions 
    WHERE subscription_id = ${subscriptionId}
  `;
  return results[0] || null;
}

async function updateAutopaySubscriptionStatus(subscriptionId, status) {
  const result = await sql`
    UPDATE autopay_subscriptions
    SET status = ${status}, updated_at = NOW()
    WHERE subscription_id = ${subscriptionId}
    RETURNING *
  `;
  return result[0] || null;
}

async function updateAutopayPaymentMethod(subscriptionId, paymentMethod) {
  const result = await sql`
    UPDATE autopay_subscriptions
    SET payment_method = ${JSON.stringify(paymentMethod)}, updated_at = NOW()
    WHERE subscription_id = ${subscriptionId}
    RETURNING *
  `;
  return result[0] || null;
}

async function updateAutopayRenewalDate(subscriptionId, nextRenewalDate) {
  const result = await sql`
    UPDATE autopay_subscriptions
    SET next_renewal_date = ${nextRenewalDate}, 
        last_charge_date = NOW(),
        failed_attempts = 0,
        updated_at = NOW()
    WHERE subscription_id = ${subscriptionId}
    RETURNING *
  `;
  return result[0] || null;
}

async function getActiveSubscriptionsForRenewal() {
  const results = await sql`
    SELECT * FROM autopay_subscriptions 
    WHERE status = 'active' 
    AND auto_charge_enabled = true
    AND next_renewal_date <= NOW() + INTERVAL '1 day'
    ORDER BY next_renewal_date ASC
  `;
  return results;
}

// ── Coupon Usage Tracking ──────────────────────────────────────────────────
async function recordCouponUsage(clerkUserId, planId, couponCode, discountAmount, originalPrice, finalPrice, subscriptionId, paymentId) {
  try {
    const result = await sql`
      INSERT INTO coupon_usage (
        clerk_user_id, plan_id, coupon_code, discount_amount, 
        original_price, final_price, subscription_id, payment_id
      ) VALUES (
        ${clerkUserId}, ${planId}, ${couponCode}, ${discountAmount},
        ${originalPrice}, ${finalPrice}, ${subscriptionId || null}, ${paymentId || null}
      )
      ON CONFLICT (clerk_user_id, plan_id) DO NOTHING
      RETURNING *
    `;
    return result[0] || null;
  } catch (err) {
    console.error('❌ Failed to record coupon usage:', err.message);
    return null;
  }
}

async function hasCouponBeenUsed(clerkUserId, planId) {
  try {
    const result = await sql`
      SELECT * FROM coupon_usage 
      WHERE clerk_user_id = ${clerkUserId} 
      AND plan_id = ${planId}
    `;
    return result.length > 0;
  } catch (err) {
    console.error('❌ Failed to check coupon usage:', err.message);
    return false;
  }
}

async function getCouponUsageByUser(clerkUserId) {
  try {
    const results = await sql`
      SELECT * FROM coupon_usage 
      WHERE clerk_user_id = ${clerkUserId}
      ORDER BY used_at DESC
    `;
    return results || [];
  } catch (err) {
    console.error('❌ Failed to fetch user coupon usage:', err.message);
    return [];
  }
}

module.exports = { 
  sql, 
  initDB, 
  saveAudit, 
  getAuditBySerial, 
  getAuditById, 
  getAllAudits, 
  updateCertificate, 
  upsertUser, 
  saveBooking, 
  saveOfferLead,
  createAutopaySubscription,
  getAutopaySubscriptionsByUser,
  getAutopaySubscriptionById,
  updateAutopaySubscriptionStatus,
  updateAutopayPaymentMethod,
  updateAutopayRenewalDate,
  getActiveSubscriptionsForRenewal,
  recordCouponUsage,
  hasCouponBeenUsed,
  getCouponUsageByUser
};
