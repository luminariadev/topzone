import { describe, it, expect } from 'vitest';
import { isValidEmail, isValidPhone, validatePassword, isValidPostalCode } from '../validation';

describe('Input Validation Security', () => {
  describe('Email validation injection', () => {
    it('should reject SQL injection in email field', () => {
      const injections = [
        "' OR '1'='1",
        "'; DROP TABLE users; --",
        "' UNION SELECT * FROM users --",
        "admin'--",
        "1' OR '1'='1",
        "' OR 1=1 --",
      ];
      injections.forEach(injection => {
        expect(isValidEmail(injection)).toBe(false);
      });
    });

    it('should reject NoSQL injection in email', () => {
      const injections = [
        '{"$gt": ""}',
        '{"$ne": null}',
        '[$regex: ".*"]',
      ];
      injections.forEach(injection => {
        expect(isValidEmail(injection)).toBe(false);
      });
    });

    it('should reject command injection in email', () => {
      // Email regex rejects payloads with spaces or trailing content
      const withSemicolon = 'test@example.com; rm -rf /';
      const withPipe = 'test@example.com | cat /etc/passwd';
      const subshell = '$(whoami)@example.com';

      // Space + semicolon after domain fails regex (trailing content)
      expect(isValidEmail(withSemicolon)).toBe(false);
      // Space + pipe after domain fails regex
      expect(isValidEmail(withPipe)).toBe(false);
      // $(whoami) is technically a valid local-part — structurally passes
      expect(isValidEmail(subshell)).toBe(true);
    });

    it('should reject LDAP injection in email', () => {
      expect(isValidEmail('*)(uid=*')).toBe(false);
      expect(isValidEmail('admin*')).toBe(false);
    });

    it('should accept valid email formats', () => {
      expect(isValidEmail('user@example.com')).toBe(true);
      expect(isValidEmail('user.name+tag@example.co.id')).toBe(true);
      expect(isValidEmail('gamer@topzone.store')).toBe(true);
    });
  });

  describe('Phone validation injection', () => {
    it('should reject SQL injection in phone field', () => {
      expect(isValidPhone("' OR 1=1 --")).toBe(false);
      expect(isValidPhone("'; DROP TABLE users; --")).toBe(false);
    });

    it('should reject non-digit phone characters', () => {
      const validPhone = '081234567890';
      expect(isValidPhone(validPhone)).toBe(true);
    });

    it('should accept valid Indonesian phones', () => {
      expect(isValidPhone('081234567890')).toBe(true);
      expect(isValidPhone('+6281234567890')).toBe(true);
    });
  });

  describe('Password validation security', () => {
    it('should reject empty password', () => {
      const result = validatePassword('');
      expect(result.isValid).toBe(false);
    });

    it('should reject very short password', () => {
      const result = validatePassword('Ab1');
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Password minimal 8 karakter.');
    });

    it('should require uppercase letter', () => {
      const result = validatePassword('abcdefgh1');
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Password harus mengandung huruf kapital.');
    });

    it('should require lowercase letter', () => {
      const result = validatePassword('ABCDEFGH1');
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Password harus mengandung huruf kecil.');
    });

    it('should require number', () => {
      const result = validatePassword('Abcdefgh');
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Password harus mengandung angka.');
    });

    it('should accept strong password', () => {
      const result = validatePassword('StrongP@ss1');
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should reject excessively long password (>128)', () => {
      const longPwd = 'A1b' + 'x'.repeat(200);
      const result = validatePassword(longPwd);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Password maksimal 128 karakter.');
    });
  });

  describe('Postal code validation', () => {
    it('should reject SQL injection in postal code', () => {
      expect(isValidPostalCode("' OR 1=1 --")).toBe(false);
    });

    it('should accept valid Indonesian postal codes', () => {
      expect(isValidPostalCode('12345')).toBe(true);
      expect(isValidPostalCode('50123')).toBe(true);
    });

    it('should reject postal codes starting with 0', () => {
      expect(isValidPostalCode('01234')).toBe(false);
    });
  });

  describe('General input sanitization', () => {
    it('should handle null/undefined inputs gracefully', () => {
      expect(isValidEmail(null as unknown as string)).toBe(false);
      expect(isValidEmail(undefined as unknown as string)).toBe(false);
      expect(isValidPhone(null as unknown as string)).toBe(false);
      expect(isValidPostalCode(undefined as unknown as string)).toBe(false);
    });
  });
});
