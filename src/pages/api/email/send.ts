---
// src/pages/api/email/send.ts
// Email sending API endpoint (Supabase Edge Function compatible) - Fase 3.2 item 1
export const prerender = false;
import type { APIRoute } from 'astro';
import { supabase } from '../../../lib/supabase';

function jsonResponse(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

// Email template generator
function generateOrderConfirmation(order: any): string {
  return `
    <html>
    <head><style>
      body { font-family: 'Space Grotesk', sans-serif; background: #f5f5f5; margin: 0; padding: 20px; }
      .container { max-width: 600px; margin: 0 auto; background: white; border: 4px solid #000; box-shadow: 8px 8px 0px #000; }
      .header { background: #FFE600; padding: 30px; text-align: center; border-bottom: 4px solid #000; }
      .header h1 { margin: 0; font-size: 28px; color: #000; }
      .content { padding: 30px; }
      .order-box { background: #f9f9f9; border: 2px solid #000; padding: 20px; margin: 20px 0; }
      .order-item { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #eee; }
      .total-box { background: #39FF14; border: 2px solid #000; padding: 15px; text-align: center; font-weight: 900; }
      .btn { display: inline-block; background: #39FF14; color: #000; padding: 12px 30px; text-decoration: none; font-weight: 900; border: 2px solid #000; margin-top: 20px; }
      .footer { background: #000; color: white; padding: 20px; text-align: center; font-size: 12px; }
    </style></head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🎮 TopZone</h1>
          <p style="margin:5px 0 0;font-weight:bold;">Konfirmasi Pesanan</p>
        </div>
        <div class="content">
          <p>Halo <strong>${order.customer_name || 'Customer'}</strong>,</p>
          <p>Pesanan kamu berhasil dibuat! Berikut detailnya:</p>

          <div class="order-box">
            <p><strong>ID Pesanan:</strong> ${order.id}</p>
            <p><strong>Tanggal:</strong> ${new Date(order.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
            <p><strong>Metode Bayar:</strong> ${order.payment_method === 'bank' ? 'Transfer Bank' : order.payment_method === 'ewallet' ? 'E-Wallet' : 'GoPay'}</p>
          </div>

          <div class="order-box">
            <h3 style="margin-top:0;">Ringkasan Pesanan</h3>
            ${JSON.parse(order.items || '[]').map((item: any) => `
              <div class="order-item">
                <span>${item.name}</span>
                <span style="font-weight:900;">Rp ${(item.price * item.qty).toLocaleString('id-ID')}</span>
              </div>
            `).join('')}
            ${order.discount > 0 ? `
              <div class="order-item" style="color:#39FF14;">
                <span>Discount (${order.discount}%)</span>
                <span style="font-weight:900;">- Rp ${Math.round(order.total * order.discount / (100 - order.discount)).toLocaleString('id-ID')}</span>
              </div>
            ` : ''}
          </div>

          <div class="total-box">
            <p style="margin:0;font-size:24px;">Total: Rp ${order.total.toLocaleString('id-ID')}</p>
          </div>

          <p style="margin-top:30px;">Silakan lakukan pembayaran sesuai metode yang dipilih. Pesanan akan diproses setelah pembayaran terkonfirmasi.</p>

          <div style="text-align:center;">
            <a href="${import.meta.env.SITE_URL || 'https://topzone.id'}/orders?id=${order.id}" class="btn">Lihat Pesanan</a>
          </div>
        </div>
        <div class="footer">
          <p>© ${new Date().getFullYear()} TopZone. All rights reserved.</p>
          <p>Platform Top-Up & Gaming Gear Terpercaya</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

function generatePaymentSuccess(order: any): string {
  return `
    <html>
    <head><style>
      body { font-family: 'Space Grotesk', sans-serif; background: #f5f5f5; margin: 0; padding: 20px; }
      .container { max-width: 600px; margin: 0 auto; background: white; border: 4px solid #000; box-shadow: 8px 8px 0px #000; }
      .header { background: #39FF14; padding: 30px; text-align: center; border-bottom: 4px solid #000; }
      .header h1 { margin: 0; font-size: 28px; color: #000; }
      .content { padding: 30px; }
      .success-box { background: #39FF14; border: 2px solid #000; padding: 20px; text-align: center; margin: 20px 0; }
      .footer { background: #000; color: white; padding: 20px; text-align: center; font-size: 12px; }
    </style></head>
    <body>
      <div class="container">
        <div class="header">
          <h1>✅ Pembayaran Berhasil!</h1>
        </div>
        <div class="content">
          <p>Halo <strong>${order.customer_name || 'Customer'}</strong>,</p>
          <p>Pembayaran untuk pesanan <strong>${order.id}</strong> telah berhasil dikonfirmasi!</p>

          <div class="success-box">
            <p style="margin:0;font-size:20px;font-weight:900;">Total Dibayar: Rp ${order.total.toLocaleString('id-ID')}</p>
          </div>

          <p>Pesanan kamu sedang diproses. Kamu akan menerima notifikasi lagi saat pesanan dikirim.</p>

          <p style="margin-top:20px;"><strong>Detail Pesanan:</strong></p>
          <ul>
            <li>ID Pesanan: ${order.id}</li>
            <li>Status: Dalam Proses</li>
            <li>Estimasi: 1×24 jam untuk digital goods</li>
          </ul>
        </div>
        <div class="footer">
          <p>© ${new Date().getFullYear()} TopZone. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

function generatePaymentFailed(order: any): string {
  return `
    <html>
    <head><style>
      body { font-family: 'Space Grotesk', sans-serif; background: #f5f5f5; margin: 0; padding: 20px; }
      .container { max-width: 600px; margin: 0 auto; background: white; border: 4px solid #000; box-shadow: 8px 8px 0px #000; }
      .header { background: #FF4444; padding: 30px; text-align: center; border-bottom: 4px solid #000; }
      .header h1 { margin: 0; font-size: 28px; color: white; }
      .content { padding: 30px; }
      .fail-box { background: #FFEEEE; border: 2px solid #FF4444; padding: 20px; text-align: center; margin: 20px 0; }
      .btn { display: inline-block; background: #FFE600; color: #000; padding: 12px 30px; text-decoration: none; font-weight: 900; border: 2px solid #000; margin-top: 20px; }
      .footer { background: #000; color: white; padding: 20px; text-align: center; font-size: 12px; }
    </style></head>
    <body>
      <div class="container">
        <div class="header">
          <h1>❌ Pembayaran Gagal</h1>
        </div>
        <div class="content">
          <p>Halo <strong>${order.customer_name || 'Customer'}</strong>,</p>
          <p>Pembayaran untuk pesanan <strong>${order.id}</strong> gagal atau kedaluwarsa.</p>

          <div class="fail-box">
            <p style="margin:0;font-weight:900;color:#FF4444;">Pesanan akan dibatalkan otomatis dalam 24 jam jika tidak dibayar.</p>
          </div>

          <p>Kamu bisa mencoba lagi dengan klik tombol di bawah:</p>

          <div style="text-align:center;">
            <a href="${import.meta.env.SITE_URL || 'https://topzone.id'}/checkout?retry=${order.id}" class="btn">Bayar Ulang</a>
          </div>
        </div>
        <div class="footer">
          <p>© ${new Date().getFullYear()} TopZone. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

function generateOrderShipped(order: any): string {
  return `
    <html>
    <head><style>
      body { font-family: 'Space Grotesk', sans-serif; background: #f5f5f5; margin: 0; padding: 20px; }
      .container { max-width: 600px; margin: 0 auto; background: white; border: 4px solid #000; box-shadow: 8px 8px 0px #000; }
      .header { background: #4FC1E9; padding: 30px; text-align: center; border-bottom: 4px solid #000; }
      .header h1 { margin: 0; font-size: 28px; color: white; }
      .content { padding: 30px; }
      .track-box { background: #E8F4FD; border: 2px solid #4FC1E9; padding: 20px; text-align: center; margin: 20px 0; }
      .footer { background: #000; color: white; padding: 20px; text-align: center; font-size: 12px; }
    </style></head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🚚 Pesanan Dikirim!</h1>
        </div>
        <div class="content">
          <p>Halo <strong>${order.customer_name || 'Customer'}</strong>,</p>
          <p>Pesanan <strong>${order.id}</strong> sedang dalam perjalanan!</p>

          <div class="track-box">
            <p style="margin:0;font-weight:900;">Digital goods akan dikirim ke akun game kamu dalam 1×24 jam.</p>
          </div>

          <p>Kamu akan menerima email konfirmasi lagi saat pesanan selesai diproses.</p>
        </div>
        <div class="footer">
          <p>© ${new Date().getFullYear()} TopZone. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

function generateWelcomeEmail(user: any): string {
  return `
    <html>
    <head><style>
      body { font-family: 'Space Grotesk', sans-serif; background: #f5f5f5; margin: 0; padding: 20px; }
      .container { max-width: 600px; margin: 0 auto; background: white; border: 4px solid #000; box-shadow: 8px 8px 0px #000; }
      .header { background: #39FF14; padding: 30px; text-align: center; border-bottom: 4px solid #000; }
      .header h1 { margin: 0; font-size: 28px; color: #000; }
      .content { padding: 30px; }
      .welcome-box { background: #FFE600; border: 2px solid #000; padding: 20px; text-align: center; margin: 20px 0; }
      .btn { display: inline-block; background: #39FF14; color: #000; padding: 12px 30px; text-decoration: none; font-weight: 900; border: 2px solid #000; margin-top: 20px; }
      .footer { background: #000; color: white; padding: 20px; text-align: center; font-size: 12px; }
    </style></head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🎮 Selamat Datang di TopZone!</h1>
        </div>
        <div class="content">
          <p>Halo <strong>${user.full_name || user.email?.split('@')[0] || 'Gamer'}</strong>,</p>
          <p>Terima kasih sudah bergabung dengan TopZone! 🎉</p>

          <div class="welcome-box">
            <p style="margin:0;font-weight:900;">🎁 Voucher Selamat Datang: WELCOME10</p>
            <p style="margin:5px 0 0;font-weight:bold;">Diskon 10% untuk pembelian pertama (min. Rp 50.000)</p>
          </div>

          <p>Berikut yang bisa kamu lakukan di TopZone:</p>
          <ul>
            <li>🎮 Top up diamond, UC, VP, dan currency game lainnya</li>
            <li>💻 Beli gaming gear dengan harga terbaik</li>
            <li>⭐ Kumpulkan poin & naikkan tier loyalty</li>
            <li>🎟 Gunakan voucher untuk diskon ekstra</li>
          </ul>

          <div style="text-align:center;">
            <a href="${import.meta.env.SITE_URL || 'https://topzone.id'}" class="btn">Mulai Belanja</a>
          </div>
        </div>
        <div class="footer">
          <p>© ${new Date().getFullYear()} TopZone. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

// Template map
const templates: Record<string, (data: any) => string> = {
  'order-confirmation': generateOrderConfirmation,
  'payment-success': generatePaymentSuccess,
  'payment-failed': generatePaymentFailed,
  'order-shipped': generateOrderShipped,
  'welcome': generateWelcomeEmail,
};

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { to, subject, template, data } = body;

    if (!to || !template) {
      return jsonResponse({ error: 'Missing required fields: to, template' }, 400);
    }

    const templateFn = templates[template];
    if (!templateFn) {
      return jsonResponse({ error: `Unknown template: ${template}. Available: ${Object.keys(templates).join(', ')}` }, 400);
    }

    const htmlContent = templateFn(data || {});

    // Save email log to Supabase if connected
    if (supabase) {
      await supabase.from('email_logs').insert({
        to_email: to,
        subject: subject || `TopZone - ${template}`,
        template: template,
        status: 'sent',
        sent_at: new Date().toISOString(),
      }).catch((e) => console.error('Email log save failed:', e));
    }

    // In production, integrate with email provider (SendGrid, Resend, etc.)
    // For now, return the HTML for preview/testing
    return jsonResponse({
      success: true,
      message: 'Email generated successfully',
      template: template,
      to: to,
      subject: subject || `TopZone - ${template}`,
      htmlPreview: htmlContent,
    });
  } catch (err) {
    console.error('Email send error:', err);
    return jsonResponse({ error: 'Internal server error' }, 500);
  }
};

export const GET: APIRoute = async () => {
  return jsonResponse({
    message: 'Email API ready',
    availableTemplates: Object.keys(templates),
  });
};
