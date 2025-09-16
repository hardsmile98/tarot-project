import { createPool } from 'mysql2/promise'
import { config } from '../config'

const db = createPool({
  host: config.DB_HOST,
  user: config.DB_USER,
  password: config.DB_PASSWORD,
  database: config.DB_DATABASE,
  timezone: '+00:00'
})

export { db }
