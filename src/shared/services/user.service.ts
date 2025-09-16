import {
  type User,
  UserModel,
  UserType
} from '../models'

export interface From {
  id: number
  is_bot: boolean
  first_name: string
  last_name: string
  username: string
  language_code: string
}

class UserService {
  static async create (from: From): Promise<User> {
    const result = await UserModel.create({
      username: from.username,
      firstName: from.first_name ?? '',
      lastName: from.last_name ?? '',
      chatid: String(from.id)
    })

    const userId = result?.insertId

    const currentDate = new Date().toString()

    return {
      id: userId,
      firstname: from.first_name ?? '',
      lastname: from.last_name ?? '',
      username: from.username,
      chatid: String(from.id),
      type: UserType.USER,
      created_at: currentDate
    }
  }

  static async getOrCreateUser (from: From) {
    const user = await UserModel.getByChatId(String(from.id))

    if (user) {
      return user
    } else {
      const newUser = await this.create(from)

      return newUser
    }
  }
}

export { UserService }
