import { db } from '@/shared'
import { type RowDataPacket, type ResultSetHeader } from 'mysql2'
import * as crypto from 'crypto'

interface Token {
  token: string
  gclid: string
  user_id: number
  utm: string
  site_url: string
  updated_at: string
  created_at: string
}

class TokenModel {
  static async generateToken ({ gclid, utm, siteUrl }: { gclid: string, utm: string, siteUrl: string }) {
    const existingToken = await this.getTokenByGclid(gclid)

    if (existingToken) {
      return existingToken.token
    }

    const token = crypto.randomBytes(16).toString('hex')

    await db.query<ResultSetHeader>(
      'INSERT INTO tokens (token, gclid, utm, site_url) VALUES (?, ?, ?, ?);',
      [
        token,
        gclid,
        utm,
        siteUrl
      ]
    )

    return token
  }

  static async getToken (token: string) {
    const [result] = await db.query<Array<Token & RowDataPacket>>(
      'SELECT * FROM tokens WHERE token = ?;',
      [token]
    )

    return result.length ? result[0] : null
  }

  static async getTokenByGclid (gclid: string) {
    const [result] = await db.query<Array<Token & RowDataPacket>>(
      'SELECT * FROM tokens WHERE gclid = ?;',
      [gclid]
    )

    return result.length ? result[0] : null
  }

  static async getTokenByUserId (userId: number) {
    const [result] = await db.query<Array<Token & RowDataPacket>>(
      'SELECT * FROM tokens WHERE user_id = ?;',
      [userId]
    )

    return result.length ? result[0] : null
  }

  static async setUserId (token: string, userId: number) {
    const [result] = await db.query<ResultSetHeader>(
      'UPDATE tokens SET user_id = ?, updated_at = NOW() WHERE token = ?;',
      [userId, token]
    )

    return result.affectedRows > 0
  }

  static async setIsSent (token: string, isSent: boolean) {
    const [result] = await db.query<ResultSetHeader>(
      'UPDATE tokens SET is_sent = ?, updated_at = NOW() WHERE token = ?;',
      [isSent, token]
    )

    return result.affectedRows > 0
  }
}

export { TokenModel, type Token }
