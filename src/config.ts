import 'dotenv/config';

export const config = {
  port: parseInt(process.env.PORT || '3000', 10),
  pocketbaseUrl: process.env.POCKETBASE_URL || 'http://47.109.109.134:8091',
  adminEmail: process.env.PB_ADMIN_EMAIL || '',
  adminPassword: process.env.PB_ADMIN_PASSWORD || '',
};
