import { Messages } from './messages'
import { SupportMessages } from './supportMessages'
import { config, UserService } from '@/shared'

enum UpdateType {
  MESSAGE = 'message',
  SUPPORT_MESSAGE = 'support'
}

class Updates {
  static getType (body: any) {
    if (body.message) {
      if (body.message.chat.type === 'private') {
        return UpdateType.MESSAGE
      }

      if (body.message.chat.id === config.GROUP_CHAT_ID) {
        return UpdateType.SUPPORT_MESSAGE
      }
    }

    return null
  }

  static async proccess (body: any) {
    const updateType = this.getType(body)

    if (!updateType) {
      return
    }

    const from = body.message?.from

    if (!from) {
      return
    }

    const user = await UserService.getOrCreateUser(from)

    if (!user) {
      return
    }

    const processors = {
      [UpdateType.MESSAGE]: Messages.process,
      [UpdateType.SUPPORT_MESSAGE]: SupportMessages.process
    }

    await processors[updateType](body, user)
  }
}

export { Updates }
