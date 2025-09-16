import {
  config,
  GoogleSheetsService,
  telegramApi,
  TokenModel,
  UserThreadModel,
  type User
} from '@/shared'

const START_COMMAND = '/start'

class Messages {
  static async process (body: any, user: User) {
    const { token, message } = body

    const text = message.text || ''
    const photo = message.photo || []
    const caption = message.caption || ''

    const thread = await UserThreadModel.getByUserId(user.id)

    const threadIdentifier = thread?.id
    const threadId = thread?.thread_id

    if (!threadIdentifier) {
      const newTopic = await telegramApi.createForumTopic(token, {
        chatid: config.GROUP_CHAT_ID,
        name: `ID ${user.id}: ${[user.firstname, user.lastname]
        .filter(Boolean).join(' ')} ${user.username ? ` (${user.username})` : ''}`
      })

      if (newTopic) {
        const newThreadId = newTopic.result.message_thread_id

        await UserThreadModel.create(user.id, newThreadId)
      }
    }

    if (text.includes(START_COMMAND)) {
      const tokenParam = text.split?.(' ')?.[1]

      if (tokenParam) {
        const token = await TokenModel.getToken(tokenParam)

        if (token && !token.user_id) {
          await TokenModel.setUserId(token.token, user.id)
        }
      }

      return
    } else {
      const token = await TokenModel.getTokenByUserId(user.id)

      if (token && !token.is_sent) {
        const isRecordSavedInGoogleSheets = await GoogleSheetsService.sendDataToGoogleSheets({
          gclid: token.gclid,
          siteUrl: token.site_url
        })

        if (isRecordSavedInGoogleSheets) {
          await TokenModel.setIsSent(token.token, true)
        }
      }
    }

    if (!threadIdentifier) {
      return
    }

    if (photo.length > 0) {
      const media = photo.map((p: any, index: number) => ({
        type: 'photo',
        media: p.file_id,
        caption: index === 0 ? caption : undefined
      }))

      await telegramApi.sendMediaGroup(token, {
        chatid: config.GROUP_CHAT_ID,
        message_thread_id: threadId,
        media
      })
    }

    if (text) {
      await telegramApi.sendMessage(token, {
        chatid: config.GROUP_CHAT_ID,
        message_thread_id: threadId,
        message: text
      })
    }
  }
}

export { Messages }
