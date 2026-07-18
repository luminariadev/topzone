// src/components/EmailTemplates.ts
// Email template utilities for transactional emails (password reset, order confirmation, etc.)
// All templates use table-based layout for maximum email client compatibility

/**
 * Base email layout wrapper with TopZone branding
 */
export function EmailLayout(opts: { title: string; children: string }): string {
  return `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${opts.title}</title>
</head>
<body style="margin:0;padding:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Oxygen,Ubuntu,sans-serif;background-color:#f5f5f5">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:600px;margin:0 auto;background-color:#ffffff">
    <tr>
      <td style="background-color:#111111;padding:30px 20px;text-align:center;border-bottom:4px solid #FFFF00">
        <a href="https://topzone.id" style="text-decoration:none;color:#FFFF00;font-size:28px;font-weight:900;letter-spacing:-1px">
          TOP<span style="background-color:#FFFF00;color:#111111;padding:4px 8px;border:2px solid #111111">ZONE</span>
        </a>
      </td>
    </tr>
    <tr>
      <td style="padding:40px 30px">${opts.children}</td>
    </tr>
    <tr>
      <td style="background-color:#f5f5f5;padding:20px 30px;text-align:center;border-top:1px solid #e5e5e5">
        <p style="margin:0 0 10px 0;color:#6b7280;font-size:14px">&copy; ${new Date().getFullYear()} TopZone. All rights reserved.</p>
        <p style="margin:0;color:#9ca3af;font-size:12px">Jika Anda tidak meminta email ini, abaikan saja.</p>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

/**
 * Password Reset Email Template
 * @param resetUrl - Full URL to the password reset page with token
 * @param userName - Optional user's name for personalization
 */
export function PasswordResetEmail(opts: { resetUrl: string; userName?: string }): string {
  const greeting = opts.userName ? `Halo ${opts.userName},` : 'Halo,';
  return EmailLayout({
    title: 'Reset Password TopZone',
    children: `
      <h1 style="color:#111111;font-size:24px;font-weight:900;margin:0 0 20px 0">Reset Password Anda</h1>
      <p style="color:#374151;font-size:16px;line-height:1.6;margin:0 0 16px 0">${greeting}</p>
      <p style="color:#374151;font-size:16px;line-height:1.6;margin:0 0 16px 0">
        Kami menerima permintaan untuk mereset password akun TopZone Anda.
        Klik tombol di bawah untuk membuat password baru:
      </p>
      <div style="text-align:center;margin:32px 0">
        <a href="${opts.resetUrl}"
          style="display:inline-block;background-color:#111111;color:#FFFF00;padding:16px 32px;font-weight:900;
                 text-decoration:none;border:3px solid #111111;box-shadow:4px 4px 0 0 #111111;font-size:16px;letter-spacing:0.5px">
          Reset Password
        </a>
      </div>
      <p style="color:#6b7280;font-size:14px;line-height:1.6;margin:24px 0 0 0">
        Atau salin tautan ini ke browser Anda:<br/>
        <span style="word-break:break-all;color:#111111;font-family:monospace">${opts.resetUrl}</span>
      </p>
      <hr style="border:none;border-top:2px solid #e5e5e5;margin:24px 0"/>
      <p style="color:#6b7280;font-size:13px;line-height:1.6;margin:0">
        <strong>Catatan:</strong> Tautan ini berlaku selama <strong>1 jam</strong>.
        Jika Anda tidak meminta reset password, abaikan email ini atau hubungi
        <a href="mailto:support@topzone.id" style="color:#111111">support@topzone.id</a>.
      </p>`,
  });
}

/**
 * Welcome Email Template
 */
export function WelcomeEmail(opts: { userName: string; voucherCode?: string }): string {
  return EmailLayout({
    title: 'Selamat Datang di TopZone',
    children: `
      <h1 style="color:#111111;font-size:24px;font-weight:900;margin:0 0 20px 0">Selamat Datang, ${opts.userName}!</h1>
      <p style="color:#374151;font-size:16px;line-height:1.6;margin:0 0 16px 0">
        Terima kasih telah bergabung dengan TopZone — platform top up game dan belanja gear gaming
        termurah, tercepat, dan terpercaya di Indonesia!
      </p>
      ${opts.voucherCode ? `
      <div style="background-color:#fef3c7;border:2px solid #f59e0b;border-radius:8px;padding:20px;margin:24px 0;text-align:center">
        <p style="margin:0 0 12px 0;color:#92400e;font-weight:900;font-size:14px">VOUCHER SELAMAT DATANG</p>
        <p style="margin:0;color:#111111;font-family:monospace;font-size:24px;font-weight:900;letter-spacing:2px">${opts.voucherCode}</p>
        <p style="margin:8px 0 0 0;color:#92400e;font-size:13px">Gunakan saat checkout untuk dapat diskon!</p>
      </div>` : ''}
      <div style="text-align:center;margin:32px 0">
        <a href="https://topzone.id/#games"
          style="display:inline-block;background-color:#39FF14;color:#111111;padding:16px 32px;font-weight:900;
                 text-decoration:none;border:3px solid #111111;box-shadow:4px 4px 0 0 #111111;font-size:16px;letter-spacing:0.5px">
          Mulai Belanja
        </a>
      </div>`,
  });
}

/**
 * Order Confirmation Email Template
 */
export function OrderConfirmationEmail(opts: {
  orderId: string;
  userName: string;
  items: Array<{ name: string; qty: number; price: number }>;
  total: number;
  paymentMethod: string;
}): string {
  const fmt = (n: number) => `Rp ${n.toLocaleString('id-ID')}`;
  const rows = opts.items.map(i => `
    <tr style="border-bottom:1px solid #e5e5e5">
      <td style="padding:12px 0;color:#374151">${i.name}</td>
      <td style="padding:12px 0;color:#374151;text-align:center">${i.qty}x</td>
      <td style="padding:12px 0;color:#374151;text-align:right">${fmt(i.price * i.qty)}</td>
    </tr>`).join('');
  return EmailLayout({
    title: `Konfirmasi Pesanan #${opts.orderId}`,
    children: `
      <h1 style="color:#111111;font-size:24px;font-weight:900;margin:0 0 8px 0">Pesanan Dikonfirmasi!</h1>
      <p style="color:#6b7280;font-size:14px;margin:0 0 24px 0">Nomor Pesanan: <strong>${opts.orderId}</strong></p>
      <p style="color:#374151;font-size:16px;line-height:1.6;margin:0 0 24px 0">
        Halo ${opts.userName}, terima kasih telah berbelanja di TopZone. Pesanan Anda telah kami terima.
      </p>
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin-bottom:24px">
        <thead>
          <tr style="border-bottom:2px solid #111111">
            <th style="padding:12px 0;text-align:left;color:#111111;font-weight:900">Produk</th>
            <th style="padding:12px 0;text-align:center;color:#111111;font-weight:900">Qty</th>
            <th style="padding:12px 0;text-align:right;color:#111111;font-weight:900">Total</th>
          </tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>
      <div style="border-top:2px solid #111111;padding-top:16px;text-align:right">
        <p style="margin:0 0 8px 0;color:#374151">Total Pembayaran</p>
        <p style="margin:0;color:#111111;font-size:24px;font-weight:900">${fmt(opts.total)}</p>
        <p style="margin:8px 0 0 0;color:#6b7280;font-size:14px">Metode: ${opts.paymentMethod}</p>
      </div>`,
  });
}

/**
 * Payment Success Email Template
 */
export function PaymentSuccessEmail(opts: {
  orderId: string;
  userName: string;
  total: number;
}): string {
  const fmt = (n: number) => `Rp ${n.toLocaleString('id-ID')}`;
  return EmailLayout({
    title: `Pembayaran Berhasil - Pesanan #${opts.orderId}`,
    children: `
      <div style="text-align:center;margin-bottom:24px">
        <div style="width:64px;height:64px;background-color:#39FF14;border:3px solid #111111;border-radius:50%;
                    margin:0 auto 16px auto;display:flex;align-items:center;justify-content:center">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#111111" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
            <path d="M20 6L9 17l-5-5"/>
          </svg>
        </div>
        <h1 style="color:#111111;font-size:24px;font-weight:900;margin:0 0 8px 0">Pembayaran Berhasil!</h1>
        <p style="color:#6b7280;font-size:14px;margin:0">Pesanan #${opts.orderId}</p>
      </div>
      <p style="color:#374151;font-size:16px;line-height:1.6;margin:0 0 16px 0">
        Halo ${opts.userName}, pembayaran Anda sebesar <strong>${fmt(opts.total)}</strong>
        telah kami terima dan diverifikasi.
      </p>
      <p style="color:#374151;font-size:16px;line-height:1.6;margin:0 0 24px 0">
        Pesanan Anda sekarang diproses. Untuk top up game, diamond/VP akan dikirim
        dalam 1-5 menit. Untuk gear gaming, kami akan mengirimkan nomor resi pengiriman.
      </p>`,
  });
}

/**
 * Payment Failed Email Template
 */
export function PaymentFailedEmail(opts: {
  orderId: string;
  userName: string;
  reason?: string;
  retryUrl: string;
}): string {
  return EmailLayout({
    title: `Pembayaran Gagal - Pesanan #${opts.orderId}`,
    children: `
      <div style="text-align:center;margin-bottom:24px">
        <div style="width:64px;height:64px;background-color:#fee2e2;border:3px solid #ef4444;border-radius:50%;
                    margin:0 auto 16px auto;display:flex;align-items:center;justify-content:center">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/>
          </svg>
        </div>
        <h1 style="color:#ef4444;font-size:24px;font-weight:900;margin:0 0 8px 0">Pembayaran Gagal</h1>
        <p style="color:#6b7280;font-size:14px;margin:0">Pesanan #${opts.orderId}</p>
      </div>
      <p style="color:#374151;font-size:16px;line-height:1.6;margin:0 0 16px 0">
        Halo ${opts.userName}, sayangnya pembayaran untuk pesanan Anda tidak berhasil diproses.
      </p>
      ${opts.reason ? `
      <div style="background-color:#fef2f2;border:1px solid #fecaca;border-radius:8px;padding:16px;margin:16px 0">
        <p style="margin:0;color:#991b1b;font-size:14px"><strong>Alasan:</strong> ${opts.reason}</p>
      </div>` : ''}
      <p style="color:#374151;font-size:16px;line-height:1.6;margin:0 0 24px 0">
        Anda bisa mencoba membayar kembali atau memilih metode pembayaran lain.
      </p>
      <div style="text-align:center;margin:32px 0">
        <a href="${opts.retryUrl}"
          style="display:inline-block;background-color:#111111;color:#FFFF00;padding:16px 32px;font-weight:900;
                 text-decoration:none;border:3px solid #111111;box-shadow:4px 4px 0 0 #111111;font-size:16px;letter-spacing:0.5px">
          Bayar Sekarang
        </a>
      </div>`,
  });
}

/**
 * Order Shipped Email Template
 */
export function OrderShippedEmail(opts: {
  orderId: string;
  userName: string;
  courier: string;
  trackingNumber: string;
  trackingUrl: string;
}): string {
  return EmailLayout({
    title: `Pesanan Dikirim - #${opts.orderId}`,
    children: `
      <div style="text-align:center;margin-bottom:24px">
        <div style="width:64px;height:64px;background-color:#dbeafe;border:3px solid #3b82f6;border-radius:50%;
                    margin:0 auto 16px auto;display:flex;align-items:center;justify-content:center">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
          </svg>
        </div>
        <h1 style="color:#111111;font-size:24px;font-weight:900;margin:0 0 8px 0">Pesanan Dikirim!</h1>
        <p style="color:#6b7280;font-size:14px;margin:0">Pesanan #${opts.orderId}</p>
      </div>
      <p style="color:#374151;font-size:16px;line-height:1.6;margin:0 0 16px 0">
        Halo ${opts.userName}, kabar baik! Pesanan gear gaming Anda telah dikirim.
      </p>
      <div style="background-color:#f5f5f5;border:2px solid #111111;border-radius:8px;padding:20px;margin:24px 0">
        <p style="margin:0 0 8px 0;color:#111111;font-weight:900">Detail Pengiriman</p>
        <p style="margin:0 0 4px 0;color:#374151">Kurir: <strong>${opts.courier}</strong></p>
        <p style="margin:0;color:#374151">No. Resi: <strong style="font-family:monospace;font-size:16px">${opts.trackingNumber}</strong></p>
      </div>
      <div style="text-align:center;margin:32px 0">
        <a href="${opts.trackingUrl}" target="_blank"
          style="display:inline-block;background-color:#3b82f6;color:#ffffff;padding:16px 32px;font-weight:900;
                 text-decoration:none;border:3px solid #1d4ed8;box-shadow:4px 4px 0 0 #1d4ed8;font-size:16px;letter-spacing:0.5px">
          Lacak Pengiriman
        </a>
      </div>`,
  });
}