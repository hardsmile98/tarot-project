import { db } from '@/shared'
import { type RowDataPacket, type ResultSetHeader } from 'mysql2'

enum UserType {
  USER = 'user',
  ADMIN = 'admin'
}

interface User {
  id: number
  username: string
  firstname: string
  lastname: string
  chatid: string
  type: UserType
  created_at: string
}

type SelectFields<T extends keyof User> = {
  [K in T]: User[K];
}

class UserModel {
  static async create ({
    username,
    firstName,
    lastName,
    chatid
  }: {
    username: string
    firstName: string
    lastName: string
    chatid: string
  }) {
    const [result] = await db.query<ResultSetHeader>(
      'INSERT INTO users (username, firstname, lastname, chatid) VALUES (?, ?, ?, ?);',
      [
        username,
        firstName,
        lastName,
        chatid
      ]
    )

    return result
  }

  static async getByChatId<T extends keyof User>(
    chatid: string,
    select?: T[]
  ): Promise<SelectFields<T> | null> {
    const fields = select ? select.join(', ') : '*'

    const [result] = await db.execute<Array<SelectFields<T> & RowDataPacket>>(
      `SELECT ${fields} FROM users WHERE chatid = ?;`, [chatid])

    return result.length ? result[0] : null
  }

  static async getById<T extends keyof User>(
    userId: number,
    select?: T[]
  ): Promise<SelectFields<T> | null> {
    const fields = select ? select.join(', ') : '*'

    const [result] = await db.execute<Array<SelectFields<T> & RowDataPacket>>(
      `SELECT ${fields} FROM users WHERE id = ?;`, [userId])

    return result.length ? result[0] : null
  }
}

export { UserModel, type User, UserType }
