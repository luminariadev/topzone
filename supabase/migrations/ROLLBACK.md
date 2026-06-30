# Rollback Procedures

## Overview
This document contains rollback procedures for each database migration in the TopZone project.

## Migrations

### 0001_products.sql
**Purpose:** Create products table with categories and pricing

**Rollback:**

**Risk:** Data loss if products exist. Backup before rollback.

### 0002_orders.sql
**Purpose:** Create orders table with payment status tracking

**Rollback:**

**Risk:** High - contains customer payment data. Backup required.

### 0003_vouchers.sql
**Purpose:** Create vouchers and discount codes

**Rollback:**

**Risk:** Medium - active vouchers will be invalidated.

### 0004_reviews.sql
**Purpose:** Create customer reviews and ratings

**Rollback:**

**Risk:** Low - customer feedback data only.

### 0005_users.sql
**Purpose:** Create user profiles and auth links

**Rollback:**

**Risk:** High - breaks user authentication. Coordinate with auth system.

### 0006_stock.sql
**Purpose:** Add stock tracking for products

**Rollback:**

**Risk:** Medium - stock data will be lost.

### 0007_admin_core.sql
**Purpose:** Create admin_users table and RBAC

**Rollback:**

**Risk:** Critical - blocks admin access. Emergency rollback only.

### 0008_admin_enhancements.sql
**Purpose:** Add audit logging and enhanced admin features

**Rollback:**

**Risk:** Medium - loses admin audit trail.

## General Rollback Procedure

1. **Backup database:**
   

2. **Run rollback SQL** (in order, reverse chronological)

3. **Verify rollback:**
   

4. **Restart application** if needed.

## Emergency Contacts
- Admin: admin@topzone.com
- DBA: (internal team)
