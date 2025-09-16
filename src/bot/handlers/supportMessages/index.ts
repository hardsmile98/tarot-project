import {
  telegramApi,
  UserModel,
  UserThreadModel,
  type User
} from '@/shared'

class SupportMessages {
  static async process (body: any, user: User) {
    const { token } = body

    const threadId = body.message.message_thread_id

    const text = body.message.text || ''
    const photo = body.message.photo || []
    const caption = body.message.caption || ''

    if (!threadId) {
      return null
    }

    const thread = await UserThreadModel.getByThreadId(threadId)

    if (!thread) {
      return null
    }

    const userFinded = await UserModel.getById(thread.user_id)

    if (!userFinded) {
      return null
    }

    if (photo.length > 0) {
      const media = photo.map((p: any, index: number) => ({
        type: 'photo',
        media: p.file_id,
        caption: index === 0 ? caption : undefined
      }))

      await telegramApi.sendMediaGroup(token, {
        chatid: userFinded.chatid,
        media
      })
    }

    if (text) {
      await telegramApi.sendMessage(token, {
        chatid: userFinded.chatid,
        message: text
      })
    }
  }
}

export { SupportMessages }
