// src/utils/validation.ts
// Form and data validation utilities for TopZone

/**
 * Validate an email address format.
 * @param email - Email string to validate
 * @returns true if the email format is valid
 */
export function isValidEmail(email: string): boolean {
  if (!email || typeof email !== 'string') return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
}

/**
 * Validate a phone number (Indonesian format: 08xx or +628xx).
 * @param phone - Phone number string
 * @returns true if phone format is valid
 */
export function isValidPhone(phone: string): boolean {
  if (!phone || typeof phone !== 'string') return false;
  const cleaned = phone.trim().replace(/[\s-]/g, '');
  return /^(?:\+62|08)\d{8,12}$/.test(cleaned);
}

/**
 * Validate order form data before submission.
 * Returns an object with field-specific error messages (empty = valid).
 */
export function validateOrder(order: {
  name?: string;
  email?: string;
  phone?: string;
  payment?: string;
}): Record<string, string> {
  const errors: Record<string, string> = {};

  if (!order.name?.trim()) {
    errors.name = 'Nama lengkap harus diisi.';
  } else if (order.name.trim().length < 3) {
    errors.name = 'Nama minimal 3 karakter.';
  }

  if (!order.email?.trim()) {
    errors.email = 'Email harus diisi.';
  } else if (!isValidEmail(order.email)) {
    errors.email = 'Format email tidak valid.';
  }

  if (!order.phone?.trim()) {
    errors.phone = 'Nomor telepon harus diisi.';
  } else if (!isValidPhone(order.phone)) {
    errors.phone = 'Format nomor telepon tidak valid. Gunakan 08xx atau +628xx.';
  }

  if (!order.payment) {
    errors.payment = 'Pilih metode pembayaran.';
  }

  return errors;
}

/**
 * Validate a password meets minimum requirements.
 * @param password - Password string
 * @returns Object with isValid flag and error messages array
 */
export function validatePassword(password: string): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!password || password.length < 8) {
    errors.push('Password minimal 8 karakter.');
  }
  if (password && password.length > 128) {
    errors.push('Password maksimal 128 karakter.');
  }
  if (password && !/[A-Z]/.test(password)) {
    errors.push('Password harus mengandung huruf kapital.');
  }
  if (password && !/[a-z]/.test(password)) {
    errors.push('Password harus mengandung huruf kecil.');
  }
  if (password && !/[0-9]/.test(password)) {
    errors.push('Password harus mengandung angka.');
  }

  return { isValid: errors.length === 0, errors };
}

/**
 * Sanitize a string by trimming and removing dangerous characters.
 * Use for search inputs and display names.
 */
export function sanitizeInput(input: string): string {
  return input
    .trim()
    .replace(/[<>"'&]/g, '') // Strip HTML special chars
    .slice(0, 500); // Max length
}

/**
 * Check if a string is a valid Indonesian postal code.
 */
export function isValidPostalCode(code: string): boolean {
  return /^[1-9]\d{4}$/.test(code.trim());
}
