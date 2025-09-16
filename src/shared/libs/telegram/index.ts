import { TELEGRAM_API_URL } from '@/shared/consts'
import { logger } from '../logger'
import { request } from '../request'

const sendTelegramRequest = async ({
  url,
  token,
  data
}: {
  url: string
  token: string
  data: any
}): Promise<any> => {
  try {
    const result = await request({
      url: `${TELEGRAM_API_URL}/bot${token}/${url}`,
      data,
      proxyEnabled: false
    })

    return result.data
  } catch (e) {
    logger.error('Error in sendTelegramRequest:', e)

    return null
  }
}

const telegramApi = {
  sendMessage: async (token: string, data: {
    chatid: string
    message: string
    reply_message_id?: string
    message_thread_id?: number
  }) => {
    const body = {
      chat_id: data.chatid,
      text: data.message,
      parse_mode: 'HTML',
      message_thread_id: data.message_thread_id,
      reply_parameters: {
        message_id: data.reply_message_id
      }
    }

    return await sendTelegramRequest({
      url: 'sendMessage',
      token,
      data: body
    })
  },

  sentPhoto: async (token: string, data: {
    chatid: string
    message_thread_id?: number
    photo: string
    caption: string
    keyboard: any
  }) => {
    const body = {
      chat_id: data.chatid,
      photo: data.photo,
      message_thread_id: data.message_thread_id,
      caption: data.caption,
      reply_markup: data.keyboard && JSON.stringify({
        inline_keyboard: data.keyboard,
        resize_keyboard: true
      })
    }

    return await sendTelegramRequest({
      url: 'sendPhoto',
      token,
      data: body
    })
  },

  sendMediaGroup: async (token: string, data: {
    chatid: string
    message_thread_id?: number
    media: Array<{ type: 'photo', media: string, caption?: string }>
  }) => {
    const body = {
      chat_id: data.chatid,
      message_thread_id: data.message_thread_id,
      media: JSON.stringify(data.media)
    }

    return await sendTelegramRequest({
      url: 'sendMediaGroup',
      token,
      data: body
    })
  },

  createForumTopic: async (token: string, data: {
    chatid: string
    name: string
  }) => {
    const body = {
      chat_id: data.chatid,
      name: data.name
    }

    return await sendTelegramRequest({
      url: 'createForumTopic',
      token,
      data: body
    })
  },

  sendMessageWithKeyboard: async (token: string, data: {
    chatid: string
    message: string
    keyboard: any
  }) => {
    const body = {
      chat_id: data.chatid,
      text: data.message,
      parse_mode: 'HTML',
      reply_markup: JSON.stringify({
        keyboard: data.keyboard,
        resize_keyboard: true
      })
    }

    return await sendTelegramRequest({
      url: 'sendMessage',
      token,
      data: body
    })
  },

  removeKeyboardAndSendMessage: async (token: string, data: {
    chatid: string
    message: string
  }) => {
    const body = {
      chat_id: data.chatid,
      text: data.message,
      parse_mode: 'HTML',
      reply_markup: JSON.stringify({
        remove_keyboard: true
      })
    }

    return await sendTelegramRequest({
      url: 'sendMessage',
      token,
      data: body
    })
  },

  answerCallbackQuery: async (token: string, data: {
    id: string
  }) => {
    const body = {
      callback_query_id: data.id
    }

    return await sendTelegramRequest({
      url: 'answerCallbackQuery',
      token,
      data: body
    })
  },

  answerCallbackQueryWithText: async (token: string, data: {
    id: string
    text: string
  }) => {
    const body = {
      callback_query_id: data.id,
      text: data.text
    }

    return await sendTelegramRequest({
      url: 'answerCallbackQuery',
      token,
      data: body
    })
  },

  deleteMessage: async (token: string, data: {
    id: string
    chatid: string
  }) => {
    const body = {
      chat_id: data.chatid,
      message_id: data.id
    }

    return await sendTelegramRequest({
      url: 'deleteMessage',
      token,
      data: body
    })
  },

  sendMessageWithInline: async (token: string, data: {
    chatid: string
    message: string
    keyboard: any
    reply_message_id?: any
  }) => {
    const body = {
      chat_id: data.chatid,
      text: data.message,
      parse_mode: 'HTML',
      reply_to_message_id: data.reply_message_id,
      reply_markup: JSON.stringify({
        inline_keyboard: data.keyboard,
        resize_keyboard: true
      })
    }

    return await sendTelegramRequest({
      url: 'sendMessage',
      token,
      data: body
    })
  },

  editMessageWithInline: async (token: string, data: {
    chatid: string
    message: string
    keyboard: any
    message_id: string
  }) => {
    const body = {
      chat_id: data.chatid,
      text: data.message,
      message_id: data.message_id,
      parse_mode: 'HTML',
      reply_markup: JSON.stringify({
        inline_keyboard: data.keyboard,
        resize_keyboard: true
      })
    }

    return await sendTelegramRequest({
      url: 'editMessageText',
      token,
      data: body
    })
  },

  editMessageWithInlineIMG: async (token: string, data: {
    chatid: string
    photo: string
    message: string
    keyboard: any
    message_id: string
  }) => {
    const body = {
      chat_id: data.chatid,
      media: JSON.stringify({
        type: 'photo',
        media: data.photo,
        caption: data.message
      }),
      message_id: data.message_id,
      parse_mode: 'HTML',
      reply_markup: JSON.stringify({
        inline_keyboard: data.keyboard,
        resize_keyboard: true
      })
    }

    return await sendTelegramRequest({
      url: 'editMessageMedia',
      token,
      data: body
    })
  },

  editMessage: async (token: string, data: {
    chatid: string
    message: string
    message_id: string
  }) => {
    const body = {
      chat_id: data.chatid,
      text: data.message,
      message_id: data.message_id,
      parse_mode: 'HTML'
    }

    return await sendTelegramRequest({
      url: 'editMessageText',
      token,
      data: body
    })
  },

  sendTextAction: async (token: string, data: {
    chatid: string
  }) => {
    const body = {
      chat_id: data.chatid,
      action: 'typing'
    }

    return await sendTelegramRequest({
      url: 'sendChatAction',
      token,
      data: body
    })
  },

  getPhotoLink: async (token: string, data: {
    file_id: string
  }) => {
    const body = {
      file_id: data.file_id
    }

    const file = await sendTelegramRequest({
      url: 'getFile',
      token,
      data: body
    })

    if (!file) {
      return ''
    }

    return `https://api.telegram.org/file/bot${token}/${file?.result?.file_path}`
  }
}

export { telegramApi }
