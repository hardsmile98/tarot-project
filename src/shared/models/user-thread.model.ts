import { db } from '@/shared'
import { type RowDataPacket, type ResultSetHeader } from 'mysql2'

interface UserThread {
  id: number
  thread_id: number
  user_id: number
}

type SelectFields<T extends keyof UserThread> = {
  [K in T]: UserThread[K];
}

class UserThreadModel {
  static async create (userId: number, threadId: number): Promise<number> {
    const [result] = await db.query<ResultSetHeader>(
      'INSERT INTO user_threads (user_id, thread_id) VALUES (?, ?);',
      [userId, threadId]
    )

    return result.insertId
  }

  static async getByUserId<T extends keyof UserThread> (userId: number, select?: T[]) {
    const fields = select ? select.join(', ') : '*'

    const [threads] = await db.query<Array<SelectFields<T> & RowDataPacket>>(
      `SELECT ${fields} FROM user_threads WHERE user_id = ?;`,
      [userId]
    )

    return threads?.length ? threads[0] : null
  }

  static async getByThreadId<T extends keyof UserThread> (threadId: number, select?: T[]) {
    const fields = select ? select.join(', ') : '*'

    const [threads] = await db.query<Array<SelectFields<T> & RowDataPacket>>(
      `SELECT ${fields} FROM user_threads WHERE thread_id = ?;`,
      [threadId]
    )

    return threads?.length ? threads[0] : null
  }
}

export { UserThreadModel, type UserThread }
