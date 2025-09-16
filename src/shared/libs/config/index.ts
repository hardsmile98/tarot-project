import dotenv from 'dotenv'

dotenv.config()

const config: Record<string, any> = {
  IS_DEV: process.env.ENV_MODE === 'dev',
  PORT: Number(process.env.PORT),
  TELEGRAM_BOT_TOKEN: process.env.TELEGRAM_BOT_TOKEN,
  WEBHOOK_BOT_URL: process.env.WEBHOOK_BOT_URL,
  DB_HOST: process.env.DB_HOST,
  DB_USER: process.env.DB_USER,
  DB_PASSWORD: process.env.DB_PASSWORD,
  DB_DATABASE: process.env.DB_DATABASE,
  GROUP_CHAT_ID: Number(process.env.GROUP_CHAT_ID),
  GOOGLE_SHEET_ID: process.env.GOOGLE_SHEET_ID
}

export { config }
