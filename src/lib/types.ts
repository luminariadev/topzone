export type EmailTemplate =
  | 'order-confirmation'
  | 'payment-success'
  | 'payment-failed'
  | 'order-shipped'
  | 'welcome'
  | 'password-reset';

export interface OrderEmailData {
  customer_name: string;
  order_id: string;
  created_at: string;
  payment_method: string;
  items: Array<{ name: string; price: number; qty: number }>;
  total: number;
  discount_amount?: number;
}

export interface PaymentEmailData {
  customer_name: string;
  order_id: string;
  total: number;
}

export interface ShippedEmailData {
  customer_name: string;
  order_id: string;
  tracking_number?: string;
  courier?: string;
}

export interface WelcomeEmailData {
  customer_name: string;
  voucher_code?: string;
}

export interface PasswordResetEmailData {
  customer_name: string;
  reset_link: string;
  token?: string;
}

export interface EmailData {
  'order-confirmation': OrderEmailData;
  'payment-success': PaymentEmailData;
  'payment-failed': PaymentEmailData;
  'order-shipped': ShippedEmailData;
  'welcome': WelcomeEmailData;
  'password-reset': PasswordResetEmailData;
}
