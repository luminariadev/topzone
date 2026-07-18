// src/lib/birthday-bonus.ts
// Birthday bonus points utility — standalone module for detecting and awarding birthday bonuses
// This can be called from a cron job or during login

export interface BirthdayBonusResult {
  eligible: boolean;
  bonusAwarded: number;
  message: string;
}

/**
 * Calculate birthday bonus based on user birth date and loyalty tier multiplier
 * Base bonus: 100 points
 * Multiplier: Bronze=1x, Silver=2x, Gold=3x, Platinum=5x
 */
function getTierMultiplier(tier: string): number {
  switch (tier) {
    case 'platinum': return 5;
    case 'gold':     return 3;
    case 'silver':   return 2;
    default:         return 1;
  }
}

/**
 * Check if today is within the user's birthday window (±3 days)
 */
export function isBirthdayWindow(birthDate: string): boolean {
  const today = new Date();
  const bday = new Date(birthDate);
  
  // Compare month and day only
  const todayMD = today.getMonth() * 100 + today.getDate();
  const bdayMD = bday.getMonth() * 100 + bday.getDate();
  
  // Allow ±3 days
  return Math.abs(todayMD - bdayMD) <= 3 || 
         Math.abs(todayMD - bdayMD) >= 360; // Handle year-end wrap
}

/**
 * Format birth date parts from a date string
 */
export function getBirthdayParts(birthDate: string): { month: number; day: number } {
  const d = new Date(birthDate);
  return { month: d.getMonth(), day: d.getDate() };
}

/**
 * Get a celebratory birthday message based on tier
 */
export function getBirthdayMessage(tier: string, bonusPoints: number): string {
  const messages: Record<string, string[]> = {
    bronze: [
      'Selamat ulang tahun! 🎉 Kami kasih kamu bonus ${bonusPoints} points.',
      'Happy birthday! 🎂 Nikmati ${bonusPoints} points spesial dari TopZone.',
    ],
    silver: [
      'Selamat ulang tahun, Silver member! 🥈 Dapatkan ${bonusPoints} bonus points!',
      'Happy birthday! 🎉 Kamu dapat ${bonusPoints} points spesial untuk member Silver!',
    ],
    gold: [
      '🎊 HBD Gold Member! 🥇 Bonus ${bonusPoints} points sudah masuk ke akunmu!',
      'Selamat ulang tahun! 🏆 ${bonusPoints} bonus points untuk Gold member terbaik!',
    ],
    platinum: [
      '💎 HAPPY BIRTHDAY PLATINUM! 💎 ${bonusPoints} bonus spesial untuk member VIP kami!',
      '✨ Selamat ulang tahun, Platinum VIP! ✨ Nikmati ${bonusPoints} bonus points eksklusif!',
    ],
  };

  const tierMessages = messages[tier] || messages.bronze;
  const idx = Math.floor(Math.random() * tierMessages.length);
  return tierMessages[idx].replace('${bonusPoints}', String(bonusPoints));
}